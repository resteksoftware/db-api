/**
 * controllers/stations.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getStationById: returns one Station by dept_id
const getStaById = (staId) => {
  return new Promise( (resolve, reject) => {
    db.stations.findOne({
      where: {
        sta_id: staId
      },
      raw: true
    })
    .then( station => resolve(station))
    .catch( err => reject(err) )
  })
}

// getAllStations: returns all stations matching departmentId
const getAllStasByDeptId = (deptId) => {
  return new Promise( (resolve, reject) => {
    db.stations.findAll({
      where: {
        dept_id: deptId
      },
      raw: true
    })
    .then( stations => resolve(stations) )
    .catch( err => reject(err) )
  })
}

// saveStation: saves Station and returns new dept_id
const saveSta = (station) => {
  return db.stations.create(station)
    .then( sta => sta.id )
    .catch( err => err )
}

// saveAllStations: saves all stations and returns success/fail
const saveAllStas = (stationsColl) => {
  return db.stations.bulkCreate(stationsColl)
    .then( response => 'success' )
    .catch( err => err )
}

// updateStation: updates a station by sta_id
const updateSta = (staId, staUpdate) => {
  return db.stations.update(staUpdate, 
    {
      returning: true,
      raw: true,
      where: {
        sta_id: staId
      }
    })
    .then(updatedSta => updatedSta)
    .catch(err => err)
}

// deleteStation: deletes a station and associated apparatus
const deleteStaById = (staId) => {
  return db.apparatus.destroy({
    where: {
      sta_id: staId
    },
    raw: true
  })
  .then( resp => {
    return db.stations.destroy({
      where: {
        sta_id: staId
      },
      raw: true
    })
  })
  .then(resp => 'station and all associated apparatus have been deleted')
  .catch(err => err)
}

module.exports = {
  getStaById         : getStaById,
  getAllStasByDeptId : getAllStasByDeptId,
  saveSta            : saveSta,
  saveAllStas        : saveAllStas,
  updateSta          : updateSta,
  deleteStaById      : deleteStaById
}
