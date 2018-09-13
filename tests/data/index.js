const app = require('./apparatus')
const carrier = require('./carriers')
const dept = require('./departments')
const inc = require('./incidents')
const sta = require('./stations')
const resp = require('./responses')
const trackUserApp = require('./track_user_apparatus')
const trackUserDept = require('./track_user_departments')
const trackUserSta = require('./track_user_stations')
const user = require('./users')

const data = {
  'app'           : app,
  'carrier'       : carrier,
  'dept'          : dept,
  'inc'           : inc,
  'sta'           : sta,
  'resp'          : resp,
  'trackUserApp'  : trackUserApp,
  'trackUserDept' : trackUserDept,
  'trackUserSta'  : trackUserSta,
  'user'          : user
}

module.exports = data
