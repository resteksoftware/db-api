/**
 * routes/stations.js
 */

const express = require('express')
const responses = express.Router()
const ctrl = require('../controllers')
const DEBUG = require('../logconfig').routes.responses


/**
 * Returns response 
 */
responses.get('/:type/:id', async (req, res, next) => {
  let type = req.params.type
  let id = req.params.id
  
  if (DEBUG) console.log(`👉 GET '/' \nbody: ${JSON.stringify(body, null, 2)}`);
  let response;
  if (type === 'resp-user-id') {
    response = { data: await ctrl.respUser.getRespUserById(id) } 
  } else if (type === 'resp-app-id') {
    response = { data: await ctrl.respApp.getRespAppById(id) }
  } else if (type === 'user-id') {
    response = { data: await ctrl.respUser.getRespUserByUserId(id) }
  } else if (type === 'app-id') {
    response = { data: await ctrl.respApp.getRespAppByAppId(id) }
  } else if (type === 'inc-id') {
    response = {
      resp_user: await ctrl.respUser.getRespUserByIncId(id),
      resp_app: await ctrl.respApp.getRespAppByIncId(id)
    }
  } else {
    response = 'error'
  }
  res.send(response)

})
/**
 * Returns response 
 */
// responses.get('/', async (req, res, next) => {
//   let body = JSON.parse(req.body)
  
//   if (DEBUG) console.log(`👉 GET '/' \nbody: ${JSON.stringify(body, null, 2)}`);
//   let response;
//   if (body.resp_user_id) {
//     response = { data: await ctrl.respUser.getRespUserById(body.resp_user_id) } 
//   } else if (body.resp_app_id) {
//     response = { data: await ctrl.respApp.getRespAppById(body.resp_app_id) }
//   } else if (body.user_id) {
//     response = { data: await ctrl.respUser.getRespUserByUserId(body.user_id) }
//   } else if (body.app_id) {
//     response = { data: await ctrl.respApp.getRespAppByAppId(body.app_id) }
//   } else if (body.inc_id) {
//     response = {
//       users: await ctrl.respUser.getRespUserByIncId(body.inc_id),
//       apps: await ctrl.respApp.getRespAppByIncId(body.inc_id)
//     }
//   } else {
//     response = 'error'
//   }
//   res.send(response)

// })


responses.post('/:userOrApp', async (req, res, next) => { 
  let userOrApp = req.params.userOrApp 
  let body = JSON.parse(req.body)
  if (DEBUG) console.log(`👉 /API/RESPONSES/${userOrApp} \nbody: ${JSON.stringify(body, null, 2)}`);
  
  let response;
  if (userOrApp === 'user') {
    let respUserId = await ctrl.respUser.saveRespUser(body)
    if (DEBUG) console.log(`👉 resp_user_id: ${respUserId}`);
    response = {resp_user_id: respUserId}
  } else if (userOrApp === 'apparatus') {
    let respAppId = await ctrl.respApp.saveRespApp(body)
    if (DEBUG) console.log(`👉 resp_app_id: ${respAppId}`);
    response = {resp_app_id: respAppId}
  } else {
    response = 'error'
  }

  res.send(response)
})


responses.patch('/:userOrApp/:respId', async (req, res, next) => { 
  let userOrApp = req.params.userOrApp
  let respId = req.params.respId
  let body = JSON.parse(req.body)
  let response;
  if (userOrApp === 'user') {
    response = await ctrl.respUser.updateRespUser(respId, body)
    //[1][0]
  } else if (userOrApp === 'apparatus') {
    response = await ctrl.respApp.updateRespApp(respId, body)
    //[1][0]    
  } else {
    response = 'error'
  }

  res.send(response)
})

/**
 * Deletes station and removes all associated apparatus
 */
responses.delete('/:userOrApp/:respId', async (req, res, next) => {
  let userOrApp = req.params.userOrApp
  let respId = req.params.respId
  let response;
  if (userOrApp === 'user') {
    response = { data: await ctrl.respUser.deleteRespUser(respId) }
    //[1][0]
  } else if (userOrApp === 'apparatus') {
    response = { data: await ctrl.respApp.deleteRespApp(respId) }
    //[1][0]    
  } else {
    response = 'error'
  }

  res.send(response)
}) 

module.exports = responses
