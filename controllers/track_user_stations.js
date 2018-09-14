/**
 * controllers/track_user_stations.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

const getTrackUserStasByUserId = (userId) => {
    return db.track_user_stations.findAll({
        where: {
            user_id: userId
        },
        raw: true
    })
    .then(apparatusIds => apparatusIds)
    .catch(err => err)
}

// saveStation: saves Station and returns new dept_id
const saveTrackUserSta = (userId, staId) => {
    let track_user_stations = {
        user_id: userId,
        sta_id: staId
    }
    return db.stations.create(track_user_stations)
    .then(userStaId => userStaId.id)
    .catch(err => err)
}


// no need for update
// TODO: deleting station association deletes all app associations
// same for dept
const deleteTrackUserStaById = (userStaId) => {
    return db.track_user_stations.findOne({
        where: {
            user_sta_id: userStaId
        },
        raw: true
    })
    .then( resp => resp.sta_id)
    .then( staId => {
        return db.track_user_apparatus.destroy({
            where: {
                sta_id: staId
            },
            raw: true
        })
    })
    .then(resp => 'user station track and associated app tracks have been deleted')
    .catch(err => err)
}

module.exports = {
    getTrackUserStasByUserId : getTrackUserStasByUserId,
    saveTrackUserSta         : saveTrackUserSta,
    deleteTrackUserStaById   : deleteTrackUserStaById
}
