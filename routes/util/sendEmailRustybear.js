/**
 * util/sendEmailRustybear.js
 *
 */

/*
 * TODO:
 * It probably makes sense to use a pooled connection, but that will mean
 * gathering all of the messages into an array and then opening the smtp
 * connection once, sending the bundle of messages, and then manually close the
 * connection. To make this happen, changes have to be made in routes/calls.js
 * in the function that calls this script.
 * For now we will open a new connection for each message.
 *
 * TODO:
 * Need to make entries for DKIM and SPF if this is something we use
 *
 */

const env = require('env2')('.env')
const nodemailer = require('nodemailer')

const DEBUG = require('../../logconfig').routes.util.sendEmailRustybear
const VERBOSE_LOGGING = false

const USERID = process.env.RUSTYBEAR_USERID
const PASSWD = process.env.RUSTYBEAR_PASSWD
const EMAIL_DOMAIN = process.env.RUSTYBEAR_EMAIL_DOMAIN
const EMAIL_PORT = '587'
const SENDER_EMAIL_ADDRESS = '"Dispatch" <firedispatch@dispatchresponse.com>'

var dateformat = require('date-fns/format')
const getToday = () => {
  var d = new Date()
  return dateformat(d, 'YYYY-MM-DD HH:mm:ss')
}

if (DEBUG) {
  var recipient = {
    userId: 'kcoyner',
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
  let poolConfig = {
    pool: false, // if set to true, close the connection
    host: EMAIL_DOMAIN,
    port: EMAIL_PORT,
    secure: false, // upgrades to TLS after connecting
    requireTLS: true,
    auth: {
      user: USERID,
      pass: PASSWD
    },
    logger: VERBOSE_LOGGING,
    debug: false
  }

  let transporter = nodemailer.createTransport(poolConfig)

  let name = `${recipient.firstName} ${recipient.lastName}`

  let message = {
    from: SENDER_EMAIL_ADDRESS,
    to: `${name} ${recipient.address}`,
    subject: 'GFD Call',
    text: `
    ${data.call_category}
    ${data.location}  ${data.city}
    ${data.assignment}
    <https://gfd.gr/${data.slug}/${recipient.userId}>
    `
  }

  // verify connection configuration
  if (DEBUG) {
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log('Server is ready to take our messages')
      }
    })
  }

  // send some email
  transporter.sendMail(message, (error, info) => {
    if (error) {
      return console.error(error)
    }
    console.log(`[${getToday()}] INFO  Rustybear email sent to: ${name} ${recipient.address} ${info.messageId}`)
  })
}

if (DEBUG) {
  sendEmail(data, recipient)
} else {
  module.exports = sendEmail
}

// transporter.close()
