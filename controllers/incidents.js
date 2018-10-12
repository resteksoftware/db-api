/**
 * controllers/incidents.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getIncById: returns one complete incident by inc_id
// a complete incident requires:
// 1. incident body
// 2. incident status
// 3. incident remarks
// 4. incident assignments
const getIncById = (incId) => {
  let incOutput;
  // get incident body and status
  return db.sequelize.query(`
    SELECT *
      FROM incidents
      RIGHT JOIN incident_statuses on incidents.inc_status_id = incident_statuses.inc_status_id
      WHERE incidents.inc_id=${incId}`,
    { type: db.sequelize.QueryTypes.SELECT })
    .then( incident => {
      incOutput = incident[0]
      // get incident assignment
      return db.incident_assignments.findAll({
        where: { inc_id: incOutput.inc_id },
        raw: true
      })
    })
    .then(incAssignments => {
      incOutput.assignments = incAssignments
      // get incident remarks
      return db.incident_remarks.findAll({
        where: { inc_id: incOutput.inc_id },
        raw: true
      })
    })
    .then(incRemarks => {
      incOutput.remarks = incRemarks
      return incOutput
    })
    .catch( err => err )
}

const getIncStatusByIncId = (incId) => {
  return db.incidents.findOne({
    where: {
      inc_id: incId
    },
    raw: true
  })
  .then( inc => inc.inc_status_id)
  .catch (err => console.error(err))
}

/**
 * Get all incidents
 * @returns {array} incidents - an array of incident objects.
 */
const getAllIncs = () => {
  return db.incidents.findAll({
    raw: true
  })
  .then( incidents => incidents )
  .catch( err => {
    console.error(`ERROR in getAllIncs: ${err}`)
  })
}

// getAllIncidents: returns all incidents by deptId
const getAllIncsByDeptId = (deptId) => {
  // get incident body and status
  return db.sequelize.query(`
  SELECT *
      FROM incidents
      RIGHT JOIN incident_statuses on incidents.inc_status_id = incident_statuses.inc_status_id
      WHERE incidents.dept_id=${deptId}
      ORDER BY incidents.inc_id DESC`,
    { type: db.sequelize.QueryTypes.SELECT })
    .then(async (incidents) => {
      let incOutput = incidents;
      // iterate across incidents
      for (var i = 0; i < incidents.length; i ++) {
        // fetch assignments associated to incident
        let incAssignments = await db.incident_assignments.findAll({
          where: { inc_id: incidents[i].inc_id },
          raw: true
        })
        // fetch remarks associated to incident
        let incRemarks = await db.incident_remarks.findAll({
          where: { inc_id: incidents[i].inc_id },
          raw: true
        })
        // append results to associated incident
        incOutput[i].assignments = incAssignments
        incOutput[i].remarks = incRemarks
      }
      return incOutput
    })
    .catch(err => console.error(err) )
}

/**
  Get incident by fire dispatch ID
 * @param {string} fireDispatchId - dispatch ID from client.
 * @returns {object} an incident object.
 */
const getIncByFireDispatchId = (fireDispatchId) => {
  return db.incidents.findAll({
    where: {
      fd_dispatch_id: fireDispatchId
    },
    raw: true
  })
  .then( incident => incident[0] )
  .catch( err => {
    console.error(`ERROR: ${err}`)
  })
}

const getIncByDeptIdAndSlug = (deptId, slug) => {
  return db.incidents.findAll({
    where: {
      [Op.and]: [
        {
          slug: slug
        },
        {
          dept_id: deptId
        }
      ]
    },
    raw: true
  })
  .then( incident => incident )
  .catch( err => err )
}

const getRecentIncsByDeptId = (deptId) => {
  return db.incidents.findAll({
    where: {
      created_at: {
        [lt]: new Date(),
        [gt]: new Date(new Date() - 24 * days * 60 * 60 * 1000)
      }
    },
    order: [['created_at', 'DESC']],
    raw: true
  })
  .then( incidents => incidents )
  .catch( err => err )
}

// saveIncident: saves incident and returns new incident_id
const saveInc = (incident, deptId, incidentStatusId) => {
  if (deptId) incident.dept_id = deptId
  if (incidentStatusId) incident.inc_status_id = incidentStatusId
  return db.incidents.create(incident)
  .then( inc => inc.id )
  .catch( err => err )
}

// saveAllIncs: saves all users and returns success/fail
const saveAllIncs = (incidentsColl) => {
  return db.incidents.bulkCreate(incidentsColl)
  .then( response => 'success' )
  .catch( err => err )
}

// deleteRespApparatus
const deleteInc = (incId) => {
  let incStatusId;
  // delete inc_assignment,
  return db.incident_assignments.destroy({
    where: {
      inc_id: incId
    },
    raw: true
  })
  // inc_remarks,
  .then( resp => {
    return db.incident_remarks.destroy({
      where: {
        inc_id: incId
      },
      raw: true
    })
  })
  // get inc_status_id
  .then( resp => {
    return db.incidents.findOne({
      where: {
        inc_id: incId
      },
      raw: true
    })
    .then( resp => {
        incStatusId = resp.inc_status_id
        return resp.inc_status_id
      })

  })
  //inc,
  .then( resp => {
    return db.incidents.destroy({
      where: { inc_id: incId },
      raw: true
    })
  })
  // delete inc_status
  .then( resp => {
    return db.incident_statuses.destroy({
      where: {
        inc_status_id: incStatusId
      }
    })
  })
  .then(resp => 'incident was successfully deleted')
  .catch(err => console.log(err))
}

// deleteAllApparatus
const deleteAllInc = (incIdArr) => {
  return db.responses_apparatus.destroy({
    where: {
      inc_id: {
        [Op.in]: incIdArr
      }
    },
    raw: true
  })
    .then(resp => 'incidents were successfully deleted')
    .catch(err => err)
}

module.exports = {
  getIncById            : getIncById,
  getIncByDeptIdAndSlug : getIncByDeptIdAndSlug,
  getIncByFireDispatchId: getIncByFireDispatchId,
  getAllIncs            : getAllIncs,
  getAllIncsByDeptId    : getAllIncsByDeptId,
  getRecentIncsByDeptId : getRecentIncsByDeptId,
  getIncStatusByIncId   : getIncStatusByIncId,
  saveInc               : saveInc,
  saveAllIncs           : saveAllIncs,
  deleteInc             : deleteInc,
  deleteAllInc          : deleteAllInc
}
