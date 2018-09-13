const app = require('./apparatus')
const carrier = require('./carriers')
const dept = require('./departments')
const incAssignment = require('./incident_assignments')
const incRemark = require('./incident_remarks')
const incStatus = require('./incident_statuses')
const inc = require('./incidents')
const respApp = require('./responses_apparatus')
const respUser = require('./responses_users')
const sta = require('./stations')
const trackUserApp = require('./track_user_apparatus')
const trackUserSta = require('./track_user_stations')
const user = require('./users')

const ctrl = {
  'app'           : app,
  'carrier'       : carrier,
  'dept'          : dept,
  'incAssignment' : incAssignment,
  'incRemark'     : incRemark,
  'incStatus'     : incStatus,
  'inc'           : inc,
  'sta'           : sta,
  'trackUserApp'  : trackUserApp,
  'trackUserSta'  : trackUserSta,
  'respApp'       : respApp,
  'respUser'      : respUser, 
  'user'          : user
}

module.exports = ctrl
