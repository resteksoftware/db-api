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

// getAllIncidentss: returns all incidents by deptId
const getAllIncsByDeptId = (deptId) => {

  // get incident joined with
  return db.incidents.findAll({
    where: {
      dept_id: deptId
    },
    raw: true
  })
  .then( incidents => incidents )
  .catch( err => err )

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

// getIncById(36)

module.exports = {
  getIncById            : getIncById,
  getIncByDeptIdAndSlug : getIncByDeptIdAndSlug,
  getAllIncsByDeptId    : getAllIncsByDeptId,
  getRecentIncsByDeptId : getRecentIncsByDeptId,
  getIncStatusByIncId   : getIncStatusByIncId,
  saveInc               : saveInc,
  saveAllIncs           : saveAllIncs,
  deleteInc             : deleteInc,
  deleteAllInc          : deleteAllInc
  
}
