/**
 * routes/apparatus.js
 *
 */

const express = require('express')
const apparatus = express.Router()
const ctrl = require('../controllers')
const DEBUG = require('../logconfig').routes.apparatus

/**
 * Returns apparatus collection from a department
 */
apparatus.get('/:deptId', async (req, res, next) => {
  let deptId = req.params.deptId
  if (DEBUG) console.log(`👉 GET /api/apparatus/${deptId}`);
  let apparatusCollection = await ctrl.app.getAllAppsByDeptId(deptId)

  res.send(apparatusCollection)
})

/**
 * Returns apparatus collection from a station
 */
apparatus.get('/:deptId/:staId', async (req, res, next) => {
  let deptId = req.params.deptId
  // need to validate if staId belongs to deptId
  let staId = req.params.staId

  let apparatusCollection = await ctrl.app.getAllAppsByStaId(staId)

  res.send(apparatusCollection)
})

/**
 * Adds apparatus to station. station_id must be a part of the req.body
 */
apparatus.post('/', async (req, res, next) => {
  let app = JSON.parse(req.body)
  if (DEBUG) console.log(`👉 POST /api/apparatus/ \n body: ${JSON.stringify(app, null, 4)} \n`);
  // if incoming body is a collection of apparatus
  if (Array.isArray(app)) {
    let response = await ctrl.app.saveAllApps(app)
    res.send({data: response})
  // else body is a single apparatus
  } else {
    let appId = await ctrl.app.saveApp(app)
    res.send({app_id: appId})
  }

})

/**
* Updates an apparatus based on appId
*/
apparatus.patch('/:appId', async (req, res, next) => {
  let appId = req.params.appId
  let bodyDetails = JSON.parse(req.body)
  let updatedApp = await ctrl.app.updateApp(appId, bodyDetails)
  res.send(updatedApp)
})

/**
* Deletes an apparatus based on appId
* Expects body as array or integer
*/
apparatus.delete('/', async (req, res, next) => {
  let body = JSON.parse(req.body)
  if (DEBUG) console.log(`\n 👉 DELETE api/apparatus/ body: ${JSON.stringify(body)} \n`);
  let deleteResp
  if (!Array.isArray(body.data)) {
    deleteResp = await ctrl.app.deleteApp(body.data)
  } else {
    deleteResp = await ctrl.app.deleteAllApps(body.data)
  }
  res.send({data: deleteResp})
})


module.exports = apparatus
