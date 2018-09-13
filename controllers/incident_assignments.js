/**
 * controllers/incident_assignments.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getIncidentAssignmentById: returns one incident_remark by inc_id
const getIncAssignmentById = (incAssignmentId) => {
  return db.incident_assignments.findOne({
    where: {
      inc_assignment_id: incAssignmentId
    }
  })
  .then( incAssignment => incAssignment )
  .catch( err => err )
}

// getAllIncidentAssignmentsByIncidentId: returns all IncidentAssignments by inc_id
const getAllIncAssignmentsByIncId = (incId) => {
  return db.incident_assignments.findAll({
    where: {
      inc_id: incId
    },
    raw: true
  })
  .then( incidentAssignments => incidentAssignments )
  .catch( err => err )
}

// saveIncidentAssignment: saves incident_remark and returns new inc_assignment_id
const saveIncAssignment = (incidentAssignment, incId) => {
  if (incId) incidentAssignment.inc_id = incId
  return db.incident_assignments.create(incidentAssignment)
  .then( inc_assignment => inc_assignment.id )
  .catch( err => err )
}

// saveAllIncidentAssignments: saves all incident_remarkes and returns success/fail
const saveAllIncAssignments = (incidentAssignmentsColl) => {
  return db.incident_assignments.bulkCreate(incidentAssignmentsColl)
  .then( response => 'success' )
  .catch( err => err )
}

// updateApparatus

// updateAllApparatus

// deleteApparatus

// deleteAllApparatus

module.exports = {
  getIncAssignmentById        : getIncAssignmentById,
  getAllIncAssignmentsByIncId : getAllIncAssignmentsByIncId,
  saveIncAssignment           : saveIncAssignment,
  saveAllIncAssignments       : saveAllIncAssignments
}
