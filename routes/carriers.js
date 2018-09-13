/**
 * routes/carriers.js
 */

const express = require('express')
const carriers = express.Router()
const ctrl = require('../controllers')
const { logDate } = require('../util/logDate')

const DEBUG = require('../logconfig').routes.carriers

/**
 * Returns carriers collection, sorted by carrier_name ASC
 */
carriers.get('/', async (req, res) => {
  let allCarriers = await ctrl.carrier.getAllCarriers()
  res.send(allCarriers)
})
/**
 * Returns a carrier by carrier_id
 */
carriers.get('/:carrierId', async (req, res, next) => {
  // if carrier is a number, it will resolve to string. otherwise it will resolve to 'NaN' as a string
  let carrierId = parseInt(req.params.carrierId).toString()
  let invokeNext = carrierId === 'NaN'

  if (DEBUG) console.log(`👉 GET /api/carriers/${carrierId}${invokeNext ? ', next() invoked' : ' (:carrierId)'}`);
  // if carrierId isn't a number, pass through to next route
  if (invokeNext) {
    next()
  } else {
    let carrier = await ctrl.carrier.getCarrierById(carrierId)
    res.send(carrier)
  }
  
})
/**
 * Returns a carrier by carrier_name
 */
carriers.get('/:carrierName', async (req, res) => {
  let carrierName = req.params.carrierName
  if (DEBUG) console.log(`👉 GET /api/carriers/${carrierName} (:carrierNext)`);

  let carrier = await ctrl.carrier.getCarrierByName(carrierName)

  res.send(carrier)
})

module.exports = carriers
