/**
 * Module for users.
 * @module routes/calls
 */

const express = require('express')
const users = express.Router()
const cuid = require('cuid')
const ctrl = require('../controllers')
const Sequelize = require('sequelize')
const { or, and } = Sequelize.Op
const dateformat = require('date-fns/format')

const DEBUG = require('../logconfig').routes.users


/**
 * Returns user matching userId
 */
users.get('/', async (req, res, next) => {
  let body = JSON.parse(req.body)
  let userRes;

  if (body.user_id) {
    userRes = await ctrl.user.getAllUsersByIds(body.user_id)
  } else if (body.sta_id) {
    userRes = await ctrl.user.getAllUsersByStationIds(body.sta_id)
  } else if (body.app_id) {
    userRes = await ctrl.user.getAllUsersByApparatusIds(body.app_id)
  } else if (body.dept_id){
    userRes = await ctrl.user.getAllUsersByDeptId(body.dept_id)
  } else {
    userRes = {data: 'error'}
  }

  res.send(userRes)
})

/**
 * Returns track list 
 */
users.get('/track/:userId', async (req, res, next) => {
  let userId = req.params.userId

  let response = {
    track_user_dept : await ctrl.trackUserDept.getTrackUserDeptsByUserId(userId),
    track_user_sta  : await ctrl.trackUserSta.getTrackUserStasByUserId(userId),
    track_user_app  : await ctrl.trackUserApp.getTrackUserAppsByUserId(userId)
  };

  res.send(response)
})


/**
 * Returns updated user matching userId
 */
users.patch('/:userId', async (req, res, next) => {
  let userId = req.params.userId
  let bodyData = JSON.parse(req.body)
  let updatedUser = await ctrl.user.updateUserById(userId, bodyData)
  res.send(updatedUser[1][0])
})

/**
 * Saves a user and associates a user with a department.
 * Returns track_id and user_id on success
 */
users.post('/', async (req, res, next) => {
  let bodyDetails = JSON.parse(req.body)

  // NOTE: user_id is automatically generated but we should reincorporate
  // cuids for user_id or build hash function for url obfuscation
  // userData.user_id = cuid.slug()
  // NOTE: we should create validation walls for this stuff, perhaps
  // abstract it to a validation folder with same route files

  // if the user variable is a collection of users
  if (Array.isArray(bodyDetails.user)) {
    let userIds = []
    let trackIds = []
    // iterate across users and save each user
    // this is to return userId with every user
    for (var i = 0; i < bodyDetails.user.length; i++) {
      let userId = await ctrl.user.saveUser(bodyDetails.user[i])
      let trackId = await ctrl.user.saveUserToDepartment(bodyDetails.dept_id, userId)
      userIds.push(userId)
      trackIds.push(trackId)
    }
    res.send({
      user_id: userIds,
      track_id: trackIds
    })
  // else user is one user, and does not require iteration
  } else {
    let userId = await ctrl.user.saveUser(bodyDetails.user)
    let trackId = await ctrl.user.saveUserToDepartment(bodyDetails.dept_id, userId)
    res.send({
      user_id: userId,
      track_id: trackId
    })

  }

})


/**
 * Saves an association between a user and an apparatus, station, or department
 */
users.post('/track', async (req, res, next) => {
  let bodyDetails = JSON.parse(req.body)
  let trackId;

  if (bodyDetails.app_id) {
    trackId = await ctrl.user.saveUserToApparatus(bodyDetails.app_id, bodyDetails.user_id)
  } else if (bodyDetails.sta_id) {
    trackId = await ctrl.user.saveUserToStation(bodyDetails.sta_id, bodyDetails.user_id)
  } else if (bodyDetails.dept_id) {
    trackId = await ctrl.user.saveUserToDepartment(bodyDetails.dept_id, bodyDetails.user_id)
  } else {
    res.send({data: 'error'})
    return
  }

  res.send({track_id: trackId})

})


/**
 * Actually deletes user.
 */
users.delete('/:userId', async (req, res, next) => {
  // skip this function if :userId is 'track'
  if (req.params.userId === 'track') {
    next()
  } else {
    let userId = req.params.userId

    // else, attempt to parse body for user_id array
    let body = (function(raw) {
        try {
            return JSON.parse(raw);
        } catch (err) {
            return false;
        }
    })(req.body)

    // if parse was successful
    if (body && userId === 'bulk') {
      let deletedUser = await ctrl.user.deleteUserById(body.user_id)
      if (DEBUG) console.log(`👉 DELETE /bulk \nbody: ${JSON.stringify(body, null, 4)} `);

      res.send({ data: deletedUser })
    } else {
      let deletedUser = await ctrl.user.deleteUserById([userId])

      res.send({ data: deletedUser })
    }
  }

})

users.delete('/track', async (req, res, next) => {

  let bodyDetails = JSON.parse(req.body)
  let result;
  if (DEBUG) console.log(`👉 DELETE api/users/track body\n${JSON.stringify(bodyDetails, null, 4)}`)
  if (bodyDetails.app_id) {
    result = await ctrl.user.deleteUserFromApparatus(bodyDetails.app_id, bodyDetails.user_id)
  } else if (bodyDetails.sta_id) {
    result = await ctrl.user.deleteUserFromStation(bodyDetails.sta_id, bodyDetails.user_id)
  } else if (bodyDetails.dept_id) {
    result = await ctrl.user.deleteUserFromDepartment(bodyDetails.dept_id, bodyDetails.user_id)
  } else {
    res.send({ data: 'error' })
    return
  }

  res.send({ data: result })

})

module.exports = users
