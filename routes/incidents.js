/**
/* Module for incidents.
 * @module routes/incidents
 */

const chalk = require('chalk')
const express = require('express')
const incidents = express.Router()
const ctrl = require('../controllers')
const processData = require('./util/processCallData')
const sendRustybearEmail = require('./util/sendEmailPooledRustybear')
const sendToSQS = require('../util/configSQS').sendToSQS

const { logDate } = require('../util/logDate')

const DEBUG = require('../logconfig').routes.incidents // Set this to 'true' to activate console logging of several important variables

/**
 * Get incidents.
 */
incidents.get('/', async (req, res) => {
  if (req.query) {
    let inc
    if (Object.keys(req.query).includes('fireId')) {
      inc = await ctrl.inc.getIncByFireDispatchId(req.query.fireId)
      res.send(inc)
    } else if (Object.keys(req.query).includes('inc_id')) {
      inc = await ctrl.inc.getIncById(req.query.inc_id)
      res.send(inc)
    } else if (Object.keys(req.query).includes('dept_id')) {
      inc = await ctrl.inc.getAllIncsByDeptId(req.query.dept_id)
      res.send(inc)
    } else {
      inc = await ctrl.inc.getAllIncs()
      res.send(inc)
    }
  }
})

/**
 * Update an incident
 */
incidents.patch('/', async (req, res) => {
  let body = JSON.parse(req.body)
  if (body.inc_status) {
    let incStatusId = body.inc_status.inc_status_id
    let incUpdate = body.inc_status.update
    let incidentStatus = await ctrl.incStatus.updateIncStatus(incStatusId, incUpdate)
    res.send(incidentStatus[1][0])
  } else {
    res.send({data: 'can only update inc_status'})
  }
})

/**
 * Get a specific call and inject the userId into it.
 * @param {string} slug - the slug identifier.
 * @param {string} userId - the userId.
 * @returns {array} Call object in a single item array. Limited attributes.
 */
incidents.get('/:deptId/:slug/:userId', async (req, res) => {
  let deptId = req.params.deptId;
  let slug = req.params.slug;
  // NOTE: userId is parsed and will likely change to a uuid
  let userId = parseInt(req.params.userId);
  let incident;
  let user = await ctrl.user.getUserById(userId)

  if (user.user_id === userId) {
    incident = await ctrl.inc.getIncByDeptIdAndSlug(deptId, slug)
    res.send(incident)
  } else {
    res.sendStatus(401).end()
  }
})

/**
 * Process incoming incident. example inputs:
 *
 * endpoint: /api/incidents/new
 * req.body: {
 *  dept_id: deptId,
 *  data: {
 *    inc: { incident info },
 *    incStatus: { incident status info },
 *    incRemark: { incident remark info },
 *    incAssignment: { incident assignment info }
 *  }
 * }
 * NOTE: dept_id is required for insertion of incident
 *
 * endpoint: /api/incidents/assignment
 * req.body: {
 *  inc_id: incId,
 *  data: {
 *    incAssignment: { incident assignment info }
 *  }
 * }
 * NOTE: inc_id is required for insertion of assignment
 *
 * endpoint: /api/incidents/remark
 * req.body: {
 *  inc_id: incId,
 *  data: {
 *    incRemark: { incident remark info }
 *  }
 * }
 * NOTE: inc_id is required for insertion of remark
 */


incidents.post('/:incType', async (req, res, next) => {
  const incType = req.params.incType;
  let body = JSON.parse(req.body)
  let incId = body.inc_id || false
  let messageGroupId = body.messageGroupId
  let deptId = JSON.parse(req.body).dept_id

  // incident is completely new
  if (incType === 'new') {
    // store incident details
    let inc = body.data.inc
    // stringify inc hot and warm zone properties
    inc.hot_zone = JSON.stringify(inc.hot_zone)
    inc.warm_zone = JSON.stringify(inc.warm_zone)

    // prepare inc_remark details
    let incRemark = {
      inc_id: '',
      remark: inc.inc_remarks
    }
    // prepare inc_assignment details
    let incAssignment = {
      inc_id: '',
      assignment: inc.inc_assignment
    }

    // prepare inc_status details
    let update = {}
    // if active then update both pending and active (remember this is a 'new' entry)
    // the client may not have a pending type of entry, they may go direct to active
    if (inc.inc_status === 'ACTIVE' || inc.inc_status === 'active') {
      update.pending = inc.lastUpdate
      update.active = inc.lastUpdate
    } else if (inc.inc_status === 'PENDING' || inc.inc_status === 'pending') {
      update.pending = inc.lastUpdate
    }

    // create a blank entry in the incident_statuses table
    let incStatusId = await ctrl.incStatus.saveIncStatus()
    // update the new entry with a pending or (pending and active) timestamp
    let incStatusUpdate = await ctrl.incStatus.updateIncStatus(incStatusId, update)

    // insert incident
    let newIncId = await ctrl.inc.saveInc(inc, deptId, incStatusId)
    // insert inc_remark
    incRemark.inc_id = newIncId
    let incRemarkId = await ctrl.incRemark.saveIncRemark(incRemark)
    // insert inc_assignment
    incAssignment.inc_id = newIncId
    let incAssignmentId = await ctrl.incAssignment.saveIncAssignment(incAssignment)

    // send the 'new' incident to SQS for consumption by mailer (email-SMS)
    sendToSQS(inc, JSON.stringify(deptId), messageGroupId)

    res.send({
      inc_id: newIncId,
      inc_status_id: incStatusId,
      inc_remark_id: incRemarkId,
      inc_assignment_id: incAssignmentId
    })

    return

  // incident is an update to assignment (new record)
  } else if (incType === 'assignment' ||
             incType === 'status' ||
             incType === 'radio_freq' ||
             incType === 'remark') {
    let fdIncId = body.data.inc_id
    let inc = await ctrl.inc.getIncByFireDispatchId(fdIncId)

    if (incType === 'assignment') {
      let assignment = body.data.incAssignment
      if (inc !== undefined) {
        let incAssignment = {
          inc_id: inc.inc_id,
          assignment: assignment
        }
        let incAssignmentId = await ctrl.incAssignment.saveIncAssignment(incAssignment)
        res.send({ inc_assignment_id: incAssignmentId })
      }
    }

    // incident is an update to remark (new record)
    if (incType === 'remark') {
      let remark = body.data.incRemark
      if (inc !== undefined) {
        let incRemark = {
          inc_id: inc.inc_id,
          remark: remark
        }
        let incRemarkId = await ctrl.incRemark.saveIncRemark(incRemark)
        res.send({ inc_remark_id: incRemarkId })
      }
    }

    // incident is an update to status (patch a record)
    if (incType === 'status') {
      let update = {}
      let incStatusObj = body.data
      if (inc !== undefined) {
        let incidentStatus = await ctrl.incStatus.getIncStatusByIncId(inc.inc_id)
        let incStatusId = incidentStatus.dataValues.inc_status_id
        let status = incStatusObj.incStatus  // i.e. ACTIVE or PENDING
        let updateTimeStamp = incStatusObj.updateTimeStamp

        if (status === 'pending' || status === 'PENDING') {
          update.pending = updateTimeStamp
        } else if (status === 'active' || status === 'ACTIVE') {
          update.active = updateTimeStamp
        } else if (status === 'closed' || status === 'CLOSED') {
          update.closed = updateTimeStamp
        } else if (status === 'cancelled' || status === 'CANCELLED') {
          update.cancelled = updateTimeStamp
        } else if (status === 'filed' || status === 'FILED') {
          update.filed = updateTimeStamp
        } else {
          console.error(`ERROR: Cannot update incident_statuses: status type not known`)
        }

        if (incStatusId) {
          // patch the inc status
          let result = await ctrl.incStatus.updateIncStatus(incStatusId, update)
          res.send({ inc_status_id: result })
        }
      }
    }

    if (incType === 'radio_freq') {
      console.info(chalk.yellow(`INFO: Not tracking radio_freq changes yet`))
    }

  } else {
    res.send({ data: 'error' })
  }

})

// incident is an update to statusId (new record)
incidents.patch('/:incStatusId', async (req, res, next) => {
  const incStatusId = req.params.incStatusId
  const body = JSON.parse(req.body)
  let update;

  // if there is an inc_id in body and no incStatusId, then go get incStatusId from inc_id
  if (body.inc_id && !incStatusId) {
    update = body.data
    incStatusId = await ctrl.inc.getIncStatusByIncId(incId)
  }

  let response = await ctrl.incStatus.updateIncStatus(incStatusId, update)

  res.send(update)

})



incidents.delete('/:incId', async (req, res, next) => {
  let incId = req.params.incId;
  let response = { data: await ctrl.inc.deleteInc(incId) }
  res.send(response)
})



module.exports = incidents
