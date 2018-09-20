/**
 * controllers/apparatus.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getApparatusById: gets one apparatus by app_id
const getAppById = (appId) => {
  return db.apparatus.findOne({
    where: {
      app_id: appId
    }
  })
  .then( app => app )
  .catch( err => err )
}

// getAllApparatus: returns all apparatuses matching sta_id
const getAllAppsByStaId = (staId) => {
  console.log('🔥');
  console.log(staId);
  
  return db.apparatus.findAll({
    where: {
      sta_id: staId
    },
    order: [
      ['app_name', 'ASC']
    ],
    raw: true
  })
  .then(result=> {
    
    console.log('🐸🐸🐸🐸🐸🐸');
    console.log(result);
    
    return result})
  .catch(err => err)
}

const getAllAppsByDeptId = (deptId) => {
  // NOTE: I tried to make this query using sequelize 'include' which is possible,
  // but did not work possibly because of 1) (unlikely) models/index.js associations
  // or 2) (most likely) the query i wrote
  // https://gist.github.com/zcaceres/83b554ee08726a734088d90d455bc566 <-- this is useful
  return db.sequelize.query(`
    SELECT apparatus.app_id, apparatus.app_name, apparatus.app_abbr,
    apparatus.is_enabled, apparatus.sta_id
      FROM apparatus 
      RIGHT JOIN stations on apparatus.sta_id = stations.sta_id
      RIGHT JOIN departments on stations.dept_id = departments.dept_id
      WHERE departments.dept_id=${deptId}`,
    { type: db.sequelize.QueryTypes.SELECT })
    .then( results => results )
    .catch( err => err)
}

// saveApparatus: saves apparatus and returns new app_id
const saveApp = (app) => {
  return db.apparatus.create(app)
      .then( app => app.id )
      .catch( err => err )
}

// saveAllApparatus
const saveAllApps = (apparatusColl) => {
  return db.apparatus.bulkCreate(apparatusColl)
    .then( response => 'success' )
    .catch( err => err )
}

// updateApp
const updateApp = (appId, app) => {
  return db.apparatus.update(app,
  {
    returning: true,
    raw: true,
    where: {
      app_id: appId
    }
  })
  .then(updatedApp => updatedApp[1])
  .catch(err => err)
}

// deleteApparatus
const deleteApp = (appId) => {
  return db.apparatus.destroy({
    where: { app_id: appId },
    raw: true
  })
  .then( resp => 'apparatus was successfully deleted')
  .catch( err => err)
}

// deleteAllApparatus
const deleteAllApps = (appIdArr) => {
  return db.apparatus.destroy({
    where: {
      app_id: {
        [Op.in]: appIdArr
      }
    },
    raw: true
  })
  .then( resp => 'apparatus was successfully deleted' )
  .catch( err => err )
}

module.exports = {
  getAppById         : getAppById,
  getAllAppsByStaId  : getAllAppsByStaId,
  getAllAppsByDeptId : getAllAppsByDeptId,
  saveApp            : saveApp,
  saveAllApps        : saveAllApps,
  updateApp          : updateApp,
  deleteApp          : deleteApp,
  deleteAllApps      : deleteAllApps
}
