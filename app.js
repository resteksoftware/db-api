/**
 * app.js
 *
 */

const bodyParser = require('body-parser')
const chalk = require('chalk')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const axios = require('axios')

// const favicon = require('serve-favicon')
const morgan = require('morgan')
const path = require('path')
const app = express()
const env = require('env2')('.env')
const db = require('./models')
const Sequelize = require('sequelize')
const {
  or,
  gt,
  lt
} = Sequelize.Op

// import routes
let apparatus = require('./routes/apparatus')
let carriers = require('./routes/carriers')
let departments = require('./routes/departments')
let incidents = require('./routes/incidents')
let stations = require('./routes/stations')
let responses = require('./routes/responses')
let users = require('./routes/users')

//NOTE: import controllers (only used for temp route /d/)
let ctrl = require('./controllers')

const NODE_ENV = process.env.NODE_ENV

const DEBUG = require('./logconfig').app

const consumeSQS = require('./util/consumeSQS').app

if (NODE_ENV !== 'mocha-testing') {
  // /** morgan - log only 4xx and 5xx responses to console */
  app.use(
    morgan('dev', {
      skip: function(req, res) {
        return res.statusCode < 400
      }
    })
  )
}

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}

// middleware
app.use(cors(corsOptions))
app.use(compression())
// app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')))

// parse various different custom JSON types as JSON
app.use(bodyParser.json({
  type: 'application/*+json'
}))
app.use(bodyParser.raw({
  type: 'application/*'
}))
app.use(bodyParser.urlencoded({
  extended: false
}))

app.options('*', cors(corsOptions)) // preflight cors, not sure if this is redundant to line 82

app.use('/api/apparatus', apparatus)
app.use('/api/carriers', carriers)
app.use('/api/departments', departments)
app.use('/api/incidents', incidents)
app.use('/api/stations', stations)
app.use('/api/responses', responses)
app.use('/api/users', users)
app.use('/d/:incId/:userId', async (req, res, next) => {
  let incId = req.params.incId
  let userId = req.params.userId

  let incData = await ctrl.inc.getIncById(incId)
  let usrData = await ctrl.user.getAllUsersByIds(userId)
  let deptData = await ctrl.dept.getDeptByUserId(userId)

  let respData = {
    resp_user: await ctrl.respUser.getRespUserByIncId(incId),
    resp_app: await ctrl.respApp.getRespAppByIncId(incId)
  }
  // NOTE: temporarily fetch more data from here to initialize the app
  res.send({
    data: {
      user: usrData,
      dept: deptData,
      inc: incData,
      resp: respData
    }
  })
})


function logErrors(err, req, res, next) {
  console.error(chalk.red(err.stack))
  next(err)
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({
      error: 'Something failed with xhr'
    })
  } else {
    next(err)
  }
}

function errorHandler(err, res, req, next) {
  res.status(500)
  console.log('hey')
  // res.send('error', { error: err})
  next(err)
}

function error404(err, res, req, next) {
  var err = new Error('Not Found')
  err.status = 404
  console.log(chalk.red('hey dude - you have an error'))
}

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)
app.use(error404)

app.get('/user-settings', (req, res) => {
  res.send(`<!DOCTYPE html><html> <head> <meta charset='utf-8'> <title>Dispatch Response</title> <style>@font-face{font-family: 'VT323'; font-style: normal; font-weight: 400; src: local('VT323 Regular'), local('VT323-Regular'), url(https://fonts.gstatic.com/s/vt323/v9/pxiKyp0ihIEF2isfFJXUdVNF.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}.container{display: flex; height: 100vh; width:100vw; justify-content: center; align-items: center; background-color: white;}.title{color: firebrick; font-family: 'VT323', monospace; font-size: 2em;}</style> </head> <body> <div class='container'> <div class='title'>Dispatch Response can only be accessed from text message.</div></div></body></html>`)
})

app.get('/dispatch-history', (req, res) => {
  res.send(`<!DOCTYPE html><html> <head> <meta charset='utf-8'> <title>Dispatch Response</title> <style>@font-face{font-family: 'VT323'; font-style: normal; font-weight: 400; src: local('VT323 Regular'), local('VT323-Regular'), url(https://fonts.gstatic.com/s/vt323/v9/pxiKyp0ihIEF2isfFJXUdVNF.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}.container{display: flex; height: 100vh; width:100vw; justify-content: center; align-items: center; background-color: white;}.title{color: firebrick; font-family: 'VT323', monospace; font-size: 2em;}</style> </head> <body> <div class='container'> <div class='title'>Dispatch Response can only be accessed from text message.</div></div></body></html>`)
})

consumeSQS.on('error', (err) => {
  console.error('ERROR during consumeSQS: ' + err.message)
})

const dbNewPost = (parsedMessage) => {
  axios.post(`http://0.0.0.0:8080/api/incidents/new`, {
        dept_id: parsedMessage.data.dept_id,
        data: {
          inc: parsedMessage.data,
          incStatus: parsedMessage.data.inc_status,
          incRemark: {
            inc_id: parsedMessage.data.incidentNum,
            remark: parsedMessage.data.inc_remarks,
          },
          incAssignment: {
            inc_id: parsedMessage.data.incidentNum,
            assignment: parsedMessage.data.inc_assignment,
          }
        }
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

const dbUpdatePost = (parsedMessage, pubType) => {
  axios.post(`http://0.0.0.0:8080/api/incidents/${pubType}`, {
        dept_id: parsedMessage.data.dept_id,
        data: parsedMessage.data
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

consumeSQS.on('message_received', (message) => {
  let parsedMessage = JSON.parse(message.Body)
  let deptId = parseInt(message.MessageAttributes.departId.StringValue)
  try {
    if (parsedMessage.pubType === 'new') {
      dbNewPost(parsedMessage)
    } else if (parsedMessage.pubType === 'assignment' ||
               parsedMessage.pubType === 'status' ||
               parsedMessage.pubType === 'radio_freq' ||
               parsedMessage.pubType === 'remark') {
      dbUpdatePost(parsedMessage, parsedMessage.pubType)
    } else {
      console.error('Unknown type of POST')
    }
  } catch (e) {
    console.log('ERROR in consumeSQS and handleMessage: ' + e.message)
  }
})

consumeSQS.start()

module.exports = app
