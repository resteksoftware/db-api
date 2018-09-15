/**
 * Module that consumes dispatch data from SQS
 * @module consumeSQS
 *
 */
const Consumer = require('sqs-consumer')
const AWS = require('aws-sdk')
const env = require('env2')('.env')
const REGION = process.env.AWS_REGION
AWS.config.update({region: REGION})

/** Client specific constants **/
const DEPT = 'GFD'
const DEPT_FULL_NAME = 'GFD'

const CONSUME_URL = 'https://sqs.us-east-1.amazonaws.com/438058720692/dispatch-processed.fifo'

/** Generic constants **/
const DEBUG = true
const chalk = require('chalk')



const dbPoster = (parsedMessage) => {
  console.log('parsedMessage: ', parsedMessage)
  // this is where we'll POST to the DB  ??
}


const app = Consumer.create({
  queueUrl: CONSUME_URL,
  region: REGION,
  handleMessage: (message, done) => {
    let parsedMessage = JSON.parse(message.Body)
    try {
      dbPoster(parsedMessage)
    } catch (e) {
      console.log('ERROR in consumeSQS and handleMessage: ' + e.message)
    }
    done() // this removes the message from the queue
  }
})

// app.on('error', (err) => {
//   console.log(err.message)
// })

// app.start()

module.exports = {
  app: app
}
