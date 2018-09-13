/**
 * routes/util/processCallData.js
 *
 * This version uses Mailgun
 */

const env = require('env2')('.env')
const API_KEY_MAILGUN = process.env.API_KEY_MAILGUN
const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN
const SENDER_EMAIL_ADDRESS = 'firedispatch@mg.dispatchresponse.com'

var mailgun = require('mailgun-js')({apiKey: API_KEY_MAILGUN, domain: EMAIL_DOMAIN})

var dateformat = require('date-fns/format')
const getToday = () => {
  var d = new Date()
  return dateformat(d, 'MM-DD-YYYY HH:mm:ss')
}

const DEBUG = require('../../logconfig').routes.util.sendEmailMailgun

if (DEBUG) {
  var recipient = {
    userId: 1,
    firstName: 'Kevin',
    lastName: 'Coyner',
    address: '2035160005@msg.fi.google.com'
  }
  var data = {
    call_category: 'MINOR ALARM',
    city: 'Tulare',
    location: '00383 Gail Street',
    assignment: 'E1 E8',
    slug: 'abcdefg'
  }
}

const sendEmail = (data, recipient) => {
  var name = `${recipient.firstName} ${recipient.lastName}`
  var contents = {
    from: SENDER_EMAIL_ADDRESS,
    to: `${name} ${recipient.address}`,
    subject: 'GFD Call',
    text: `
  ${data.call_category}
  ${data.location}  ${data.city}
  ${data.assignment}
  <https://gfd.gr/${data.slug}/${recipient.userId}>
  `,
    'h:Reply-To': SENDER_EMAIL_ADDRESS,
    'h:smtp.mailfrom': SENDER_EMAIL_ADDRESS,
    'h:Return-Path': SENDER_EMAIL_ADDRESS,
    'h:X-Mailgun-Native-Send': true
  }
  mailgun.messages().send(contents, function (error, body) {
    if (error) {
      console.error(error)
    } else {
      console.log(`${getToday()} Mailgun email sent to: ${name} ${recipient.address} ${body.id}`)
    }
  })
}

if (DEBUG) {
  sendEmail(data, recipient)
} else {
  module.exports = sendEmail
}

/*  version using mailcomposer to build your own MIME */
// var mailcomposer = require('mailcomposer')
// var mail = mailcomposer({
//   from: 'Excited User <no-reply@dispatchresponse.com>',
//   to: [{name: 'Kevin', address: '2035160005@msg.fi.google.com'}],
//   subject: 'Hello 456 GFD',
//   text: 'Testing Mailgun awesomeness!'
// });
// mail.build(function (mailBuildError, message) {
//     var dataToSend = {
//         to: '2035160005@msg.fi.google.com',
//         message: message.toString('ascii'),
//         'h:Reply-To': 'GFD <no-reply@dispatchresponse.com>',
//         'h:smtp.mailfrom': 'GFD <no-reply@dispatchresponse.com>',
//         'h:Return-Path': 'GFD <no-reply@dispatchresponse.com>'
//     };
//     mailgun.messages().sendMime(dataToSend, function (sendError, body) {
//         if (sendError) {
//             console.log(sendError);
//             return;
//         } else {
//           console.log(body);
//         }
//     });
// });
