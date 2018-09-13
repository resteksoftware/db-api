/**
 * controllers/carriers.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getCarrierById: gets one carrier by carrier_id
const getCarrierById = (carrierId) => {
  return db.carriers.findOne({
      where: {
        carrier_id: carrierId
      },
      raw: true
    })
    .then( carrier => carrier )
    .catch( err => err )
}

// getCarrierByName: gets one carrier by name
const getCarrierByName = (carrierName) => {
  return db.carriers.findOne({
      where: {
        carrier_name: carrierName
      },
      raw: true
    })
    .then( carrier => carrier )
    .catch( err => err )
}

// getAllCarriers: returns all carriers
const getAllCarriers = () => {
  return db.carriers.findAll({
      order: [
        ['carrier_name', 'ASC']
      ],
      raw: true
    })
    .then( carriers => carriers )
    .catch( err => err )
}

// saveCarrier: saves carrier and returns new carrier_id
const saveCarrier = (carrier) => {
  return db.carriers.create(carrier)
    .then( carrier => carrier.id )
    .catch( err => err )
}

// saveAllCarriers: saves all carriers and returns success/fail
const saveAllCarriers = (carriersColl) => {
  return db.carriers.bulkCreate(carriersColl)
    .then( response => 'success' )
    .catch( err => err )
}


module.exports = {
  getCarrierById   : getCarrierById,
  getCarrierByName : getCarrierByName,
  getAllCarriers   : getAllCarriers,
  saveCarrier      : saveCarrier,
  saveAllCarriers  : saveAllCarriers
}
