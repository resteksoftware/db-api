/**
 * @module util/logDate
 *
 * Generate a formatted datetimestamp for use with logging
 * @param {string} type - optional log type [INFO, WARN, ERROR, DEBUG]
 * @returns {string} formatted datetime string
 *
 */

const { DateTime } = require('luxon')

const logDate = (type) => `[${DateTime.local().toISO()}] ${type || 'ERROR'}: `

module.exports = { logDate }
