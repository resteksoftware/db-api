/**
 * Module that configs SQS
 * @module configSQS
 *
 */
const chalk = require('chalk')
const Consumer = require('sqs-consumer')
const AWS = require('aws-sdk')
const env = require('env2')('.env')
const REGION = process.env.AWS_REGION
AWS.config.update({region: REGION})
const NODE_ENV = process.env.NODE_ENV

let PRODUCE_URL = ''
let CONSUME_URL = ''

if (NODE_ENV === 'development') {
  CONSUME_URL = 'https://sqs.us-east-1.amazonaws.com/438058720692/test-stacked.fifo'
  PRODUCE_URL = 'https://sqs.us-east-1.amazonaws.com/438058720692/test-sms.fifo'
} else if (NODE_ENV === 'production') {
  CONSUME_URL = 'https://sqs.us-east-1.amazonaws.com/438058720692/dispatch-stacked.fifo'
  PRODUCE_URL = 'https://sqs.us-east-1.amazonaws.com/438058720692/dispatch-sms.fifo'
} else {
  console.error(`ERROR: CONSUME_URL for SQS has not been defined`)
}

const consumeSQS = Consumer.create({
  queueUrl: CONSUME_URL,
  region: REGION,
  attributeNames: ['All'],
  messageAttributeNames: ['departId'],
  handleMessage: (message, done) => {
    done() // this removes the message from the queue
  }
})

const sendToSQS = (messageBody, departId, messageGroupId) => {
  AWS.config.update({region: REGION})
  let sqs = new AWS.SQS({apiVersion: '2012-11-05'})
  let params = {
    MessageAttributes: {
      departId: {
        DataType: 'String',
        StringValue: departId
      }
    },
    MessageGroupId: messageGroupId,
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: PRODUCE_URL
  }
  sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.error(chalk.red(`ERROR in SQS sendMessage: ${err}`))
    } else {
      console.log(chalk.blue(`Success: ${data.MessageId}`))
    }
  })
}

module.exports = {
  consumeSQS: consumeSQS,
  sendToSQS: sendToSQS
}
