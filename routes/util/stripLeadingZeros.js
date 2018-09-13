/**
 * Module to strip leading zeros from a street address
 *
 * @module stripLeadingZeros
 * @param {string} Street address (with or without a street number).
 * @returns {string} Street address with any leading zeros stripped out.
 */

const stripLeadingZeros = (location) => {
  let locationArr = location.replace(/\s+/g, ' ').trim().split(' ')
  let firstWord = locationArr[0]

  if (isNaN(firstWord)) {
    return location.replace(/\s+/g, ' ').trim()
  } else {
    locationArr.splice(0, 1, parseInt(firstWord))
    return locationArr.join(' ')
  }
}

module.exports = stripLeadingZeros
