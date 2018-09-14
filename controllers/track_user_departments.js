/**
 * controllers/track_user_departments.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete


const getTrackUserDeptsByUserId = (userId) => {
    return db.track_user_departments.findAll({
        where: {
            user_id: userId
        },
        raw: true
    })
    .then(userDeptIds => userDeptIds)
    .catch(err => err)
    
}

// saveStation: saves Station and returns new dept_id
const saveTrackUserDept = (userId, deptId) => {
    let track_user_departments = {
        user_id: userId,
        dept_id: deptId
    }
    return db.departments.create(track_user_departments)
    .then(trkUsrApp => trkUsrApp.id)
    .catch(err => err)
}


// deleteApparatus

// deleteStation: deletes a station and associated apparatus
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
    getTrackUserDeptsByUserId: getTrackUserDeptsByUserId,
    saveTrackUserDept: saveTrackUserDept,
    deleteTrackUserDeptById: deleteTrackUserDeptById
}