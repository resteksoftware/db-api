//https://github.com/marak/Faker.js/
var faker = require('faker');

let numWords = [
  ['One', 1],
  ['Two', 2],
  ['Three', 3],
  ['Four', 4],
  ['Five', 5],
  ['Six', 6],
  ['Seven', 7],
  ['Eight', 8],
  ['Nine', 9],
  ['Ten', 10],
  ['Eleven', 11],
  ['Twelve', 12],
  ['Thirteen', 13],
  ['Fourteen', 14],
  ['Fifteen', 15],
  ['Sixteen', 16],
  ['Seventeen', 17],
  ['Eighteen', 18],
  ['Nineteen', 19],
  ['Twenty', 20]
 ]

let station = {
    'sta_name'   : 'Station ',
    'sta_abbr'   : 'STA',
    'is_enabled' : true,
    'sta_type'   : '',
    // needs dept_id
    'sta_gps'    : ''
}

// generates stations collection
const genStations = (numStations, deptId) => {
  // set output as empty collection
  let output = []
  // set num stations desired (1-20 max)
  let staMax = numStations
  // set potential types for station
  let staTypes = ['volley', 'career', 'combo']
  // build collection
  for (var i = 0; i < staMax; i++) {
    // set random lat
    let lat = faker.address.latitude()
    // set random lng
    let lng = faker.address.longitude()
    // randomly select a station type
    let staType = staTypes[getRandomIntInclusive(0, 2)]
    // clone station object
    let sta = Object.assign({}, station)
    // set station name
    sta.sta_name = sta.sta_name + numWords[i][0]
    // set station abbr
    sta.sta_abbr = sta.sta_abbr + numWords[i][1]
    // set station type
    sta.sta_type = staType
    // set station gps
    sta.sta_gps = `{lat:${lat} , lng:${lng}}`

    if (deptId) sta.dept_id = deptId

    output.push(sta)
  }
  return output;
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}


module.exports = {
  genStations: genStations
}
