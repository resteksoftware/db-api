/**
/* Module for calls.
 * @module routes/calls
 */

const express = require('express')
const incidents = express.Router()
const ctrl = require('../controllers')
const processData = require('./util/processCallData')
const sendRustybearEmail = require('./util/sendEmailPooledRustybear')

const { logDate } = require('../util/logDate')

const DEBUG = require('../logconfig').routes.incidents // Set this to 'true' to activate console logging of several important variables

/**
 * Get all incidents ordered by created_at DESC.
 * @returns {array} Call objects in an array.
 */
incidents.get('/', async (req, res) => {
  let body = JSON.parse(req.body)
  if (DEBUG) console.log(`👉 GET api/incidents/ \n body: ${JSON.stringify(body, null, 2)}`);
  let incRes;
  if (body.inc_id) {
    incRes = await ctrl.inc.getIncById(body.inc_id)
    res.send(incRes)
  } else if (body.dept_id){
    incRes = await ctrl.inc.getAllIncsByDeptId(body.dept_id)
    res.send(incRes)
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
  let body = JSON.parse(req.body).data;
  let deptId = JSON.parse(req.body).dept_id
  let incId = body.inc_id || false

  // incident is completely new
  if (incType === 'new') {
    // store incident details
    let inc = body.inc
    // stringify inc properties
    inc.dept_id = deptId
    inc.hot_zone = JSON.stringify(inc.hot_zone)
    inc.warm_zone = JSON.stringify(inc.warm_zone)
    // store inc_status details
    let incStatus = body.incStatus
    // store inc_remark details
    let incRemark = { 
      inc_id: '',
      remark: body.incRemark + ''
    }
    // store inc_assignment details
    let incAssignment = {
      inc_id: '',
      assignment: body.incAssignment + ''
    }

    // insert inc_status
    let incStatusId = await ctrl.incStatus.saveIncStatus(incStatus)
    // insert incident
    let newIncId = await ctrl.inc.saveInc(inc, deptId, incStatusId)
    // insert inc_remark
    incRemark.inc_id = newIncId
    incAssignment.inc_id = newIncId
    let incRemarkId = await ctrl.incRemark.saveIncRemark(incRemark)
    // insert inc_assignment
    let incAssignmentId = await ctrl.incAssignment.saveIncAssignment(incAssignment)


    res.send({
      inc_id: newIncId,
      inc_status_id: incStatusId,
      inc_remark_id: incRemarkId,
      inc_assignment_id: incAssignmentId
    })

    return

  // incident is an update to assignment (new record)
  } else if (incType === 'assignment') {
    if (incId) {
      let incAssignment = {
        inc_id: incId,
        assignment: body.incAssignment
      }

      let incAssignmentId = await ctrl.incAssignment.saveIncAssignment(incAssignment)

      res.send({ inc_assignment_id: incAssignmentId })
    }
  // incident is an update to remark (new record)
  } else if (incType === 'remark') {
    if (incId) {
      let incRemark = {
        inc_id: incId,
        remark: body.incRemark
      }

      let incRemarkId = await ctrl.incRemark.saveIncRemark(incRemark)

      res.send({ inc_remark_id: incRemarkId })
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
