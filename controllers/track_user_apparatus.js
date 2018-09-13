/**
 * controllers/stations.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getApparatusByUserId: returns apparatus list by user_id
const getAppsByUserId = (userId) => {
  return new Promise( (resolve, reject) => {
    db.track_user_apparatus.find({
      where: {
        user_id: userId
      },
      raw: true
    })
    .then( apparatusIds => resolve(apparatusIds) )
    .catch( err => reject(err) )
  })
}

// saveStation: saves Station and returns new dept_id
const saveTrackUserApp = (userId, appId) => {
  let track_user_apparatus = {
    user_id : userId,
    app_id  : appId
  }
  return new Promise( (resolve, reject) => {
    db.stations.create(station)
    .then( trkUsrApp => resolve(trkUsrApp.id) )
    .catch( err => reject(err) )
  })
}


// updateApparatus

// updateAllApparatus

// deleteApparatus

// deleteAllApparatus
