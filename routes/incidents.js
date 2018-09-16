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
 * Process (POST) a new incoming call.
 */
 incidents.post('/:deptId', async (req, res) => {
   /**
   * PART 0 OF POST:
   * Determine who POSTer is
   * NOTE: this will be factored out in the future
   */

   const deptId = req.params.deptId
   const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
   let body = null
   let processedData;

   if (Object.values(req.query).length !== 0) {
     /* x-www-form-urlencoded, therefore use req.query */
     body = req.query
   } else {
     /* raw, therefore use req.body and JSON.parse it */
     body = JSON.parse(req.body)
   }

   if (DEBUG) console.log('IP: ', IP)
   // logging to figure out what Dispatch is sending
   if (DEBUG) console.info(`${logDate('INFO')}FROM DISPATCH AT IP ${IP} UNFORMATTED:  ${JSON.stringify(body, null, 4)}`)

   /**
   * PART 1 OF POST:
   * Process incoming call data and break out to conform to necessary inserts
   * NOTE: this will factored out in the future
   */

  console.log('************ body: ', body)

   let inc;
   let incStatus;
   let incRemark;
   let incAssignment;

   if (body.hasOwnProperty('formatted')) {
     inc = body.formatted.inc
     inc.slug = 'dkfjakdsg' // TODO: fix this with real slugs
     inc.hot_zone = JSON.stringify(inc.hot_zone)
     inc.warm_zone = JSON.stringify(inc.warm_zone)
     incStatus = body.formatted.incStatus
     incRemark = body.formatted.incRemark
     incAssignment = body.formatted.incAssignment
   } else {
     processedData = await processData(body)

     incStatus = {
       'pending'   : '',
       'active'    : '',
       'closed'    : '',
       'cancelled' : '',
       'filed'     : ''
     };

     inc = {
       'fd_dispatch_id'  : processedData.cfs_no           || '',
       'slug'            : processedData.slug             || '',
       'timeout'         : processedData.timeout          || '',
       'radio_freq'      : processedData.radio_freq       || '',
       'inc_category'    : processedData.call_category    || '',
       'inc_description' : processedData.call_description || '',
       'inc_type_code'   : processedData.call_type        || '',
       'apt_no'          : processedData.apt_no           || '',
       'location'        : processedData.location         || '',
       'location_name'   : processedData.location_name    || '',
       'location_type'   : processedData.location_type    || '',
       'city'            : processedData.city             || '',
       'zip'             : processedData.zip              || '',
       'cross_street'    : processedData.cross_street     || '',
       'map_ref'         : processedData.map_ref          || '',
       'latitude'        : processedData.latitude         || '',
       'longitude'       : processedData.longitude        || '',
       'hot_zone'        : processedData.hot_zone         || '',
       'warm_zone'       : processedData.warm_zone        || '',
       'test_call'       : processedData.test_call        || ''
     };

     incRemark = {
       'remark': processedData.cfs_remark
     };

     incAssignment = {
       'assignment': processedData.assignment
     };

   }

  /**
   * PART 2 OF POST:
   * Insert incoming incident as records
   */
    // insert inc_status
    let incStatusId = await ctrl.incStatus.saveIncStatus(incStatus)
    // insert incident
    console.log('*************************************************');
    console.log('incStatusId: ', incStatusId)
    console.log('inc: ', inc)
    console.log('deptId: ', deptId)
    let incId = await ctrl.inc.saveInc(inc, deptId, incStatusId)
    // insert inc_remark
    console.log('incId: ', incId)
    console.log('*************************************************');
    let incRemarkId = await ctrl.incRemark.saveIncRemark(incRemark, incId)
    // insert inc_assignment
    let incAssignmentId = await ctrl.incAssignment.saveIncAssignment(incAssignment, incId)

  /**
   * PART 3 OF POST:
   * Fetch users that should be notified about the incident that was just inserted
   * Return array of users as 'usersSubscribed'
   */

   // If call_type = 850, then this is the 0800 test and everyone should get it
   // even if they are asleep. Otherwise, parse out user-apparatus relationships
   // and respect everyone's sleep setting.
   let usersSubscribed;

   if (inc.inc_type_code === '850') {
    // get all users from department
     usersSubscribed = await ctrl.user.getAllUsersByDeptId(deptId)
   } else {
     // get all apparatuses in department as sta_abbr + sta_id keys
     let deptApps = await ctrl.app.getAllAppsByDeptId(deptId)
     // filter apparatuses down to apparatuses on incident assignment
     let incAppAssignment = incAssignment.assignment.split(',').filter(app => app !== '')
     // filter department apparatuses down to apparatuses on incident assignment
     let appAssignmentIds = deptApps.filter(app => incAppAssignment.includes(app.app_abbr)).map(app => app.app_id)
     // get all user_tracking_apparatus based on apparatus keys filtered
     let usersTrackingAppAssignment = await ctrl.user.getAllUsersByApparatusIds(appAssignmentIds)
     // map users down to ids
     let userIdsSubscribed = usersTrackingAppAssignment.map( user => user.user_id)
     // get all users from userIdsSubscribed
     usersSubscribed = await ctrl.user.getAllUsersByIds(userIdsSubscribed)
   }

   // TODO: send email using usersSubscribed

   incidents.delete('/:incId', async (req, res, next) => {
     let incId = req.params.incId;
     let response = { data: await ctrl.inc.deleteInc(incId) }
     res.send(response)
   })

   res.send({
     users             : usersSubscribed,
     inc_id            : incId,
     inc_status_id     : incStatusId,
     inc_remark_id     : incRemarkId,
     inc_assignment_id : incAssignmentId
   })

 })




module.exports = incidents
