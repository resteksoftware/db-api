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

const CONSUME_URL = 'https://sqs.us-east-1.amazonaws.com/438058720692/dispatch-processed.fifo'

const app = Consumer.create({
  queueUrl: CONSUME_URL,
  region: REGION,
  attributeNames: ['All'],
  messageAttributeNames: ['departId'],
  handleMessage: (message, done) => {
    done() // this removes the message from the queue
  }
})

module.exports = {
  app: app
}
