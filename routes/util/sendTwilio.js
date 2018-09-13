/**
 * routes/util/sendTwilio.js
 *
 * This version uses Twilio SMS
 */

const env = require('env2')('.env')
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN)

var dateformat = require('date-fns/format')
const getToday = () => {
  var d = new Date()
  return dateformat(d, 'MM-DD-YYYY HH:mm:ss')
}

const DEBUG = require('../../logconfig').routes.util.sendTwilio

if (DEBUG) {
  var recipient = {
    userId: 'abcdefg',
    firstName: 'Kevin',
    lastName: 'Coyner',
    mobile: '+12035160005'
  }
  var data = {
    call_category: 'MINOR ALARM',
    city: 'Tulare',
    location: '00383 Gail Street',
    assignment: 'E1 E8',
    slug: 'abcdefg'
  }
}

const sendSMS = (data, recipient) => {
  let name = `${recipient.firstName} ${recipient.lastName}`
  client.messages
    .create({
      to: recipient.mobile,
      from: '+12034091989',
      body: `
${data.call_category}
${data.location}  ${data.city}
${data.assignment}
<https://gfd.gr/${data.slug}/${recipient.userId}>
      `
    })
    .then(message => console.log(`${getToday()} Twilio SMS sent to: ${name} ${recipient.mobile} ${message.sid}`))
}

if (DEBUG) {
  sendSMS(data, recipient)
} else {
  module.exports = sendSMS
}
