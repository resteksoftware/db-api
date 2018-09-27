/**
 * util/sendEmailPooledRustybear.js
 *
 */

const env = require('env2')('.env')
const nodemailer = require('nodemailer')

const DEBUG = require('../../logconfig').routes.util.sendEmailPooledRustybear
const VERBOSE_LOGGING = true

const USERID = process.env.RUSTYBEAR_USERID
const PASSWD = process.env.RUSTYBEAR_PASSWD
const EMAIL_DOMAIN = process.env.RUSTYBEAR_EMAIL_DOMAIN
const EMAIL_PORT = '587'
const SENDER_EMAIL_ADDRESS = process.env.RUSTYBEAR_USERID

var dateformat = require('date-fns/format')
const getToday = () => {
  var d = new Date()
  return dateformat(d, 'YYYY-MM-DD HH:mm:ss')
}

if (DEBUG) {
  var recipients = [
    { userId: 'kcoyner',
      firstName: 'Kevin',
      lastName: 'Coyner',
      address: 'rustybear@gmail.com' },
    { userId: 'kbcoyner',
      firstName: 'Kevin B',
      lastName: 'Coyner',
      address: '2035160005@msg.fi.google.com' }
  ]
  var data = {
    call_category: 'MINOR ALARM',
    city: 'Tulare',
    location: '00383 Gail Street',
    assignment: 'E1 E8',
    slug: 'abcdefg'
  }
}

const sendEmail = (data, recipients) => {
  let messages = []

  recipients.forEach(recipient => {
    let name = `${recipient.firstName} ${recipient.lastName}`
    messages.push({
      from: SENDER_EMAIL_ADDRESS,
      to: `${name} ${recipient.address}`,
      subject: 'UDOG',
      text: `${data.inc_category}
 ${data.location} ${data.city}
 <https://gfd.gr/${data.slug}/${recipient.userId}>
`
    })
  })

  let poolConfig = {
    pool: true, // if set to true, close the transporter connection
    maxConnections: 5,
    host: EMAIL_DOMAIN,
    port: EMAIL_PORT,
    socketTimeout: 30000, // set to timeout after 30 sec with no activity
    secure: false, // upgrades to TLS after connecting
    requireTLS: true,
    auth: {
      user: USERID,
      pass: PASSWD
    },
    logger: VERBOSE_LOGGING,
    debug: false // set to true for even more details
  }

  // create and hold open the connection with the ESP
  let transporter = nodemailer.createTransport(poolConfig)

  transporter.on('idle', function () {
    while (transporter.isIdle() && messages.length) {
      transporter.sendMail(messages.shift(), (error, info) => {
        if (error) {
          return console.error(error)
        }
        if (info.accepted.length !== 0) {
          console.log(`[${getToday()}] INFO  Email sent. To: ${info.accepted[0]}, Response: ${info.response}, Id: ${info.messageId}`)
        }
        if (info.rejected.length !== 0) {
          console.log(`[${getToday()}] REJECTED  Email not sent. To: ${info.rejected[0]}, Response: ${info.response}, Id: ${info.messageId}`)
        }
        // if (transporter.isIdle() && messages.length === 0) {
        //   transporter.close()
        // }
      })
    }
  })
}

if (DEBUG) {
  sendEmail(data, recipients)
} else {
  module.exports = sendEmail
}
