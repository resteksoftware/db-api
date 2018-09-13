/**
/* Module to get longitude and latitude coordinates.
 * @module util/getCoordinates
 */

const axios = require('axios')
const GAPI_KEY = process.env.GAPI_KEY

/**
 * Get longitude and latitude coordinates.
 * @param {string} address - the street address.
 * @param {string} district - the district or city.
 * @returns {object} Longitude and latitude.
 */
function getCoordinates (address, district) {
  let addressFormatted

  if (address.includes('#')) {
    addressFormatted = address.replace(/\#/g, '')
  } else {
    addressFormatted = address
  }

  addressFormatted = addressFormatted.split(' ').join('_')
  let mapQuery = `https://maps.google.com/maps/api/geocode/json?address=${addressFormatted}+${district}+CT&key=${GAPI_KEY}`

    // NOTE: if you break the request URL into new lines, tagged template strings will add
    // space characters (%20) in runtime, causing a URL request error
  return axios.get(mapQuery)
      .then(response => {
        return {
          lat: response.data.results[0].geometry.location.lat,
          lng: response.data.results[0].geometry.location.lng
        }
      })
      .catch(err => {
        console.log('ERROR: coordinates were not retrieved from fallback', err)
      })
}

module.exports = getCoordinates
