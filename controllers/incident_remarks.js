/**
 * controllers/incident_remarks.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getincidentRemarkById: returns one incident_remark by inc_id
const getIncRemarkById = (incRemarkId) => {
  return db.incident_remarks.findOne({
    where: {
      inc_remark_id: incRemarkId
    }
  })
  .then( incRemark => incRemark )
  .catch( err => err )
}

// getAllIncidentsStatusesByIncidentId: returns all incidentRemarks by inc_id
const getAllIncRemarksByIncId = (incId) => {
  return db.incident_remarks.findAll({
    where: {
      inc_id: incId
    },
    raw: true
  })
  .then( incidentRemarks => incidentRemarks )
  .catch( err => err )
}

// saveIncidentRemark: saves incident_remark and returns new inc_remark_id
const saveIncRemark = (incidentRemark) => {
  return db.incident_remarks.create(incidentRemark)
  .then( inc_remark => {
    return inc_remark.id
  })
  .catch( err => {
    console.error(`ERROR in saveIncRemark: ${err}`)
  })
}

// saveAllIncidentRemarks: saves all incident_remarkes and returns success/fail
const saveAllIncRemarks = (incidentRemarkColl) => {
  return db.incident_remarks.bulkCreate(incidentRemarkColl)
  .then( response => 'success' )
  .catch( err => err )
}

// updateApparatus

// updateAllApparatus

// deleteApparatus

// deleteAllApparatus

module.exports = {
  getIncRemarkById        : getIncRemarkById,
  getAllIncRemarksByIncId : getAllIncRemarksByIncId,
  saveIncRemark           : saveIncRemark,
  saveAllIncRemarks       : saveAllIncRemarks
}
