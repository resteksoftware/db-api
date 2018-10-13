/**
 *  models/index.js
 */

const Sequelize = require('sequelize')
const env = require('env2')('.env')
const chalk = require('chalk')

// Retrieve environment variables
const NODE_ENV = process.env.NODE_ENV
const DB_PG_PASSWD = process.env.DB_PG_PASSWD

// Initialize database settings
var db = {}
var shouldLog = require('../logconfig').models.index
var isDbConnSSL = false // for AWS use true, for localhost use false

// TODO:  change next line by removing mocha-testing before going into
// production
//
if (NODE_ENV === 'production' || NODE_ENV === 'mocha-testing') {
  var DBNAME = 'smrtfire'
  var DBUSER = 'webapplogin'
  var dbHost = 'dispatchresponse.cyqnwvgizc2j.us-east-1.rds.amazonaws.com'
  isDbConnSSL = true
} else if (NODE_ENV === 'development' || NODE_ENV === 'mocha-testing') {
  var DBNAME = 'smrtfire_clone'
  var DBUSER = 'webapplogin'
  var dbHost = 'restek-dev.czxcxlqkmhwz.us-east-1.rds.amazonaws.com'
  isDbConnSSL = true
  if (NODE_ENV === 'mocha-testing') {
    shouldLog = false
  }
} else {
  console.error(chalk.red(`ERROR: No database connection was made`))
}

const sequelize = new Sequelize(DBNAME, DBUSER, DB_PG_PASSWD, {
  host: dbHost,
  dialect: 'postgres',
  dialectOptions: { ssl: isDbConnSSL },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false,
  define: {
    charset: 'utf8',
    timestamps: true,
    userscored: true
  },
  logging: false
})

db.sequelize = sequelize
db.Sequelize = Sequelize

var Incident = require('./incidents')(sequelize, Sequelize)
var Incident_assignment = require('./incident_assignments')(sequelize, Sequelize)
var Incident_status = require('./incident_statuses')(sequelize, Sequelize)
var Incident_remark = require('./incident_remarks')(sequelize, Sequelize)
var User = require('./users')(sequelize, Sequelize)
var Carrier = require('./carriers')(sequelize, Sequelize)
var Department = require('./departments')(sequelize, Sequelize)
var Station = require('./stations')(sequelize, Sequelize)
var Apparatus = require('./apparatus')(sequelize, Sequelize)
var Track_user_apparatus = require('./track_user_apparatus')(sequelize, Sequelize)
var Track_user_department = require('./track_user_departments')(sequelize, Sequelize)
var Track_user_station = require('./track_user_stations')(sequelize, Sequelize)
var Responses_apparatus = require('./responses_apparatus')(sequelize, Sequelize)
var Responses_user = require('./responses_users')(sequelize, Sequelize)
var Session = require('./session')(sequelize, Sequelize)


User.belongsTo(Carrier, {foreignKey: 'carrier_id'}) // adds carrier_id to user


User.hasMany(Track_user_station, { foreignKey: 'user_sta_id' })
User.hasMany(Track_user_department, { foreignKey: 'user_dept_id' })
User.hasMany(Track_user_apparatus, { foreignKey: 'user_app_id' })

Department.hasMany(Track_user_department, { foreignKey: 'user_dept_id'})
Station.hasMany(Track_user_station, { foreignKey: 'user_sta_id'})
Apparatus.hasMany(Track_user_apparatus, { foreignKey: 'user_app_id'})

Department.hasMany(Station, { foreignKey: 'sta_id'})
Station.belongsTo(Department, { foreignKey: 'dept_id' })
Station.hasMany(Apparatus, { foreignKey: 'app_id'})
Apparatus.belongsTo(Station, { foreignKey: 'sta_id'})

Incident.belongsTo(Department, { foreignKey: 'inc_status_id' })
Incident.belongsTo(Incident_status, { foreignKey: 'inc_status_id' })

Incident.hasMany(Incident_remark, { foreignKey: 'inc_remark_id' })
Incident_remark.belongsTo(Incident, { foreignKey: 'inc_id' })

Incident.hasMany(Incident_assignment, { foreignKey: 'inc_assignment_id' })
Incident_assignment.belongsTo(Incident, { foreignKey: 'inc_id' })

Incident.hasMany(Responses_user, { foreignKey: 'resp_user_id' })
User.hasMany(Responses_user, { foreignKey: 'resp_user_id' })

Incident.hasMany(Responses_apparatus, { foreignKey: 'resp_app_id' })
Apparatus.hasMany(Responses_apparatus, { foreignKey: 'resp_app_id' })

Track_user_department.belongsTo(Department, { foreignKey: 'dept_id' })
Track_user_department.belongsTo(User, { foreignKey: 'user_id' })
Department.hasMany(Track_user_department, { foreignKey: 'user_dept_id' })
User.hasMany(Track_user_department, { foreignKey: 'user_dept_id' })

Track_user_station.belongsTo(Station, { foreignKey: 'sta_id' })
Track_user_station.belongsTo(User, { foreignKey: 'user_id' })
Station.hasMany(Track_user_station, { foreignKey: 'user_sta_id' })
User.hasMany(Track_user_station, { foreignKey: 'user_sta_id' })

Track_user_apparatus.belongsTo(Apparatus, { foreignKey: 'app_id' })
Track_user_apparatus.belongsTo(User, { foreignKey: 'user_id' })
Station.hasMany(Track_user_apparatus, { foreignKey: 'user_app_id' })
User.hasMany(Track_user_apparatus, { foreignKey: 'user_app_id' })

Responses_apparatus.belongsTo(Apparatus, { foreignKey: 'app_id'})
Responses_apparatus.belongsTo(Incident, { foreignKey: 'inc_id'})
Apparatus.hasMany(Responses_apparatus, { foreignKey: 'resp_app_id' })
Incident.hasMany(Responses_apparatus, { foreignKey: 'resp_app_id' })

Responses_user.belongsTo(User, { foreignKey: 'user_id'})
Responses_user.belongsTo(Incident, { foreignKey: 'inc_id'})
User.hasMany(Responses_user, { foreignKey: 'resp_user_id' })
Incident.hasMany(Responses_user, { foreignKey: 'resp_user_id' })


db.incidents = Incident
db.incident_assignments = Incident_assignment
db.incident_statuses = Incident_status
db.incident_remarks = Incident_remark
db.users = User
db.carriers = Carrier
db.departments = Department
db.stations = Station
db.apparatus = Apparatus
db.track_user_apparatus = Track_user_apparatus
db.track_user_departments = Track_user_department
db.track_user_stations = Track_user_station
db.responses_apparatus = Responses_apparatus
db.responses_users = Responses_user
db.sessions = Session

module.exports = db
