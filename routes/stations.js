/**
 * routes/stations.js
 */

const express = require('express')
const stations = express.Router()
const ctrl = require('../controllers')
const DEBUG = require('../logconfig').routes.stations


/**
 * Returns station collection from given department
 */
stations.get('/:deptId', async (req, res, next) => {
  let deptId = req.params.deptId
  let stationCollection = await ctrl.sta.getAllStasByDeptId(deptId)

  res.send(stationCollection)
})

/**
 * Returns single station from given department
 */
stations.get('/:deptId/:staId', async (req, res, next) => {
  let deptId = req.params.deptId
  let staId = req.params.staId
  let station = await ctrl.sta.getStaById(staId)

  res.send(station)
})

/**
 * Adds station to department and returns stationId
 */
stations.post('/', async (req, res, next) => { 
  let sta = JSON.parse(req.body)
  if (DEBUG) console.log(`👉 POST /api/stations/ \n body: ${JSON.stringify(sta, null, 4)} \n`);
  
  // if inoming body is a collection of stations
  if (Array.isArray(sta)) {
    let response = await ctrl.sta.saveAllStas(sta)
    res.send({data: response})
  // else body is a single station
  } else {
    let staId = await ctrl.sta.saveSta(sta)
    res.send({sta_id: staId})
  }
})

/**
 * Updates a station and returns updated station
 */
stations.patch('/:staId', async (req, res, next) => { 
  let staId = req.params.staId 
  let body = JSON.parse(req.body)
  let updatedSta = await ctrl.sta.updateSta(staId, body)
  res.send(updatedSta[1][0])
  
})

/**
 * Deletes station and removes all associated apparatus
 */
stations.delete('/:staId', async (req, res, next) => {
  let staId = req.params.staId 
  let result = await ctrl.sta.deleteStaById(staId)
  
  res.send({data: result})
}) 

module.exports = stations
