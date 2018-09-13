/**
 * controllers/responses_apparatus.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getApparatusById: gets one apparatus by app_id
const getRespAppById = (respAppId) => {
    return db.responses_apparatus.findOne({
        where: {
            res_app_id: respAppId
        },
        raw: true
    })
        .then(app => app)
        .catch(err => err)
}

const getRespAppByAppId = (appId) => {
    return db.responses_apparatus.findOne({
        where: {
            app_id: appId
        },
        raw: true
    })
    .then(respApp => respApp)
    .catch(err => err)
}

const getRespAppByIncId = (incId) => {
    return db.responses_apparatus.findOne({
        where: {
            inc_id: incId
        },
        raw: true
    })
    .then(app => app)
    .catch(err => err)
}

// saveApparatus: saves apparatus and returns new app_id
const saveRespApp = (app) => {
    return db.responses_apparatus.create(app)
    .then(resApp => resApp.id)
    .catch(err => err)
}


// updateRespApp
const updateRespApp = (respAppId, respUpdate) => {
    return db.responses_apparatus.update(respUpdate,
        {
            returning: true,
            raw: true,
            where: {
                resp_app_id: respAppId
            }
        })
        .then(updatedRespApp => updatedRespApp[1])
        .catch(err => err)
}

// deleteRespApparatus
const deleteRespApp = (respAppId) => {
    return db.responses_apparatus.destroy({
        where: { resp_app_id: respAppId },
        raw: true
    })
        .then(resp => 'apparatus response was successfully deleted')
        .catch(err => err)
}

// deleteAllApparatus
const deleteAllRespApps = (respAppIdArr) => {
    return db.responses_apparatus.destroy({
        where: {
            resp_app_id: {
                [Op.in]: respAppIdArr
            }
        },
        raw: true
    })
        .then(resp => 'apparatus responses were successfully deleted')
        .catch(err => err)
}

module.exports = {
    getRespAppById         : getRespAppById,
    getRespAppByAppId      : getRespAppByAppId,
    getRespAppByIncId      : getRespAppByIncId,
    saveRespApp            : saveRespApp,
    updateRespApp          : updateRespApp,
    deleteRespApp          : deleteRespApp,
    deleteAllRespApps      : deleteAllRespApps
}
