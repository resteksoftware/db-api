/**
 * controllers/track_user_apparatus.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

const getTrackUserAppsByUserId = (userId) => {
  return db.track_user_apparatus.findAll({
    where: {
      user_id: userId
    },
    raw: true
  })
  .then( apparatusIds => apparatusIds )
  .catch( err => err ) 
}

const saveTrackUserApp = (userId, appId) => {
  let track_user_apparatus = {
    user_id : userId,
    app_id  : appId
  }
  return  db.stations.create(track_user_apparatus)
  .then( userAppId => userAppId.id )
  .catch( err => err )
}

// no need for update

const deleteTrackUserDeptById = (userAppId) => {
  return db.track_user_departments.destroy({
    where: {
      user_app_id: userAppId
    },
    raw: true
  })
  .then(resp => 'user app track has been deleted')
  .catch(err => err)
}


module.exports = {
  getTrackUserAppsByUserId : getTrackUserAppsByUserId,
  saveTrackUserApp         : saveTrackUserApp,
  deleteTrackUserDeptById  : deleteTrackUserDeptById,
}

