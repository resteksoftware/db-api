/**
 * controllers/responses_users.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getApparatusById: gets one apparatus by app_id
const getRespUserById = (RespUserId) => {
    return db.responses_users.findOne({
        where: {
            resp_user_id: RespUserId
        }
    })
        .then(app => app)
        .catch(err => err)
}

const getRespUserByUserId = (userId) => {
    // TODO: limit query to most recent 20 responses or something (nfd)
    return db.responses_users.findAll({
        where: {
            user_id: userId
        },
        raw: true
    })
    .then( respUsers => respUsers )
    .catch( err => err )
}

const getRespUserByIncId = (incId) => {
    return db.sequelize.query(`
    SELECT * 
        FROM responses_users AS ru
        RIGHT JOIN users 
        ON ru.user_id=users.user_id
        WHERE inc_id=${incId}`,
        { type: db.sequelize.QueryTypes.SELECT })
    .then( respUser => respUser)
    .catch( err => err )
}

// saveApparatus: saves apparatus and returns new app_id
const saveRespUser = (respUser) => {
    return db.responses_users.create(respUser)
    .then(respUser => respUser.id )
    .catch(err => err)
}


// updateRespUser
const updateRespUser = (respUserId, respUpdate) => {
    return db.responses_users.update(respUpdate,
        {
            returning: true,
            raw: true,
            where: {
                resp_user_id: respUserId
            }
        })
        .then(updatedRespUser => updatedRespUser[1])
        .catch(err => err)
}

// deleteRespUseraratus
const deleteRespUser = (respUserId) => {
    return db.responses_users.destroy({
        where: { resp_user_id: respUserId },
        raw: true
    })
        .then(resp => 'user response was successfully deleted')
        .catch(err => err)
}

// deleteAllApparatus
const deleteAllRespUser = (RespUserIdArr) => {
    return db.responses_users.destroy({
        where: {
            resp_app_id: {
                [Op.in]: RespUserIdArr
            }
        },
        raw: true
    })
        .then(resp => 'apparatus responses were successfully deleted')
        .catch(err => err)
}

module.exports = {
    getRespUserById: getRespUserById,
    getRespUserByUserId: getRespUserByUserId,
    getRespUserByIncId: getRespUserByIncId,
    saveRespUser: saveRespUser,
    updateRespUser: updateRespUser,
    deleteRespUser: deleteRespUser,
    deleteAllRespUser: deleteAllRespUser
}
