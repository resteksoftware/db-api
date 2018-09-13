/*
 * util/genUserId.js
 *
 * Generate a 7-digit alphanumeric random string
 *
 */

const cuid = require('cuid')

const genUserId = () => {
  console.log(cuid.slug())
}

genUserId()
