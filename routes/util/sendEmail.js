/**
 * routes/util/processCallData.js
 *
 * This version uses SES sendEmail
 */

const emailTransporter = require('../../util/sendEmailSES')

/**
 * Send processed data to SMS-via-email
 */
const sendEmail = (data, recipient) => {
  var params = {
    Destination: {
      ToAddresses: [ recipient.address.trim() ]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <p>${data.call_category}</p>
          <p>Location: ${data.location}  ${data.city}</p>
          <p>Assignment: ${data.assignment}</p>
          <p>Details: https://gfd.gr/${data.slug}/${recipient.userId}</p>
          <br>
          `
        },
        Text: {
          Charset: 'UTF-8',
          Data: `

${data.call_category}
${data.location}  ${data.city}
${data.assignment}
<https://gfd.gr/${data.slug}/${recipient.userId}>
`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'GFD Call'
      }
    }, // end Message
    Source: 'no-reply@dispatchresponse.com',
    ReplyToAddresses: [ 'no-reply@dispatchresponse.com' ]
  }

  // Send the email
  emailTransporter.sendEmail(params).promise().then(
    function (data) {
      console.log(`Email sent successfully to ${recipient.address} with msgId of ${data.MessageId}`)
    }).catch(
    function (err) {
      console.error(`ERROR: Email not sent to ${recipient.address} --> ${err} ${err.stack}`)
    })
}

module.exports = sendEmail
