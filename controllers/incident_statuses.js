/**
 * controllers/incidents_statuses.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getIncidentStatusById: returns one incident_status by inc_id
const getIncStatusById = (incStatusId) => {
    return db.incident_statuses.findOne({
      where: {
        inc_status_id: incStatusId
      }
    })
    .then( incStatus => incStatus )
    .catch( err => err )
}

/**
 * Get a specific incident status entry
 * @param {number} incId - the incident ID used in the DB (primary key).
 * @returns {object} incidentStatus - the incident status entry
 */
const getIncStatusByIncId = (incId) => {
  return db.incidents.findOne({
      where: {
        inc_id: incId
      },
      raw: true
    })
    .then(inc => {
      return db.incident_statuses.findOne({
        where: {
          inc_status_id: inc.inc_status_id
        }
      })
    })
    .then( incidentStatus => incidentStatus )
    .catch( err => {
      console.error(`ERROR in getIncStatusByIncId: ${err}`)
    })
}

/**
 * Create a new incident status entry
 * @returns {number} incStatusId - the incident status ID for the new entry
 */
const saveIncStatus = () => {
  return db.incident_statuses.create()
  .then( incStatus => incStatus.id )
  .catch( err => {
    console.error(`ERROR in saveIncStatus: ${err}`)
  })
}

// saveAllIncidents: saves all incident_statuses and returns success/fail
const saveAllIncStatuses = (incidentStatusColl) => {
  return db.incident_statuses.bulkCreate(incidentStatusColl)
    .then( response => 'success' )
    .catch( err => err )
}

/**
 * Update a specific incident status entry with a timestamp
 * @param {number} incStatusId - the incident status ID to be updated.
 * @param {object} incStatusUpdate - key/value pair with value = timestamp.
 * @returns {array} updatedStatus - an array with item count and incident status object(s)
 */
const updateIncStatus = (incStatusId, incStatusUpdate) => {
  return db.incident_statuses.update(
    incStatusUpdate,
  {
    returning: true,
    raw: true,
    where: {
      inc_status_id: incStatusId
    }
  })
  .then(updatedStatus => updatedStatus)
  .catch(err => {
    console.error(`ERROR in updateIncStatus: ${err}`)
  })
}

// updateAllApparatus

// deleteApparatus

// deleteAllApparatus

module.exports = {
  getIncStatusById    : getIncStatusById,
  getIncStatusByIncId : getIncStatusByIncId,
  saveIncStatus       : saveIncStatus,
  saveAllIncStatuses  : saveAllIncStatuses,
  updateIncStatus     : updateIncStatus
}
