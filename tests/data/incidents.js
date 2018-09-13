//https://github.com/marak/Faker.js/
var faker = require('faker');
var zone = require('../../util/geofenceUtils')
var appCtrl = require('../../controllers/apparatus')
var DateTime = require('luxon').DateTime

let incident = {
    'fd_dispatch_id'  : '',
    'slug'            : '',
    'timeout'         : '',
    'radio_freq'      : '',
    'inc_category'    : '',
    'inc_description' : '',
    'inc_type_code'   : '',
    'apt_no'          : '',
    'location'        : '',
    'location_name'   : '',
    'location_type'   : '',
    'city'            : '',
    'zip'             : '',
    'cross_street'    : '',
    'map_ref'         : '',
    'latitude'        : '',
    'longitude'       : '',
    'hot_zone'        : '',
    'warm_zone'       : '',
    'test_call'       : true
  }

let incident_status = {
    'pending'   : '',
    'active'    : '',
    'closed'    : '',
    'cancelled' : '',
    'filed'     : ''
}

let incident_assignment = {
  'assignment' : ''
}

let incident_remark = {
  'remark' : ''
}

let inc_categories = [
  '0800 HOUR TEST',
  'STILL ALARM',
  'MVA WITH INJURIES - FD',
  'MINOR HAZMAT',
  'ELEVATOR / LOCKOUT / LOCKIN',
  'MINOR ALARM',
  'REPORTED STRUCTURE FIRE',
  'MAJOR MVA - FD',
  'TECHNICAL RESCUE',
  'MUTUAL AID',
  'BOX ALARM',
  'CONFIRMED WORKING FIRE'
]

let inc_type_code = [
  '806',
  '812',
  '816',
  '890',
  '820',
  '891',
  '803',
  '802',
  '850',
  '801',
  '800',
  '804',
]

// randomly generates data for location, location_name, and location_type
const genLocationInfo = () => {
  let locTypes = ['Address', 'Premise', 'Intersection']
  let idx = getRandomIntInclusive(0, locTypes.length - 1)
  let typeSelected = locTypes[idx]
  let output = {}

  // type is ADDRESS
  if (typeSelected === 'Address') {
    output.location = faker.address.streetAddress("###")
    output.location_name = faker.address.streetAddress("###")
    output.location_type = typeSelected
  // type is PREMISE
  } else if (typeSelected === 'Premise') {
    output.location      = faker.address.streetAddress("###")
    output.location_name = faker.company.companyName()
    output.location_type = typeSelected
  // type is INTERSECTION
  } else {
    output.location      = `${faker.address.streetName()} and ${faker.address.streetName()}`
    output.location_name = `${faker.address.streetName()} and ${faker.address.streetName()}`
    output.location_type = typeSelected
  }

  return output
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}


const genIncident = () => {
  // generate array of numbers asc [1, 2, 3, ...]
  let numsAsc = Array.from(Array(100).keys())
  let loc = genLocationInfo()

  let inc = Object.assign({}, incident)

  inc.fd_dispatch_id  = faker.helpers.replaceSymbolWithNumber("##########")
  inc.slug            = faker.random.uuid().split('-')[0]
  inc.timeout         = faker.date.recent();
  inc.radio_freq      = 'CHA' + numsAsc[getRandomIntInclusive(0, 50)]
  inc.inc_category    = inc_categories[getRandomIntInclusive(0, inc_categories.length - 1)]
  inc.inc_description = inc_categories[getRandomIntInclusive(0, inc_categories.length - 1)]
  inc.inc_type_code   = inc_type_code[getRandomIntInclusive(0, inc_type_code.length - 1)]
  inc.apt_no          = getRandomIntInclusive(0, 100) < 10 ? faker.address.secondaryAddress() : ''
  inc.location        = loc.location
  inc.location_name   = loc.location_name
  inc.location_type   = loc.location_type
  inc.city            = faker.address.city()
  inc.zip             = faker.address.zipCode()
  inc.cross_street    = loc.location_type === 'Intersection' ? loc.location_type : `${faker.address.streetName()} and ${faker.address.streetName()}`
  inc.map_ref         = ['A', 'B', 'C', 'D', 'E'][getRandomIntInclusive(0, 4)] + numsAsc[getRandomIntInclusive(0, 5)]
  inc.latitude        = faker.address.latitude()
  inc.longitude       = faker.address.longitude()
  inc.hot_zone        = zone.buildGeoFence(6, inc.latitude, inc.longitude, .2)
  inc.warm_zone       = zone.buildGeoFence(6, inc.latitude, inc.longitude, 1)
  inc.test_call       = true

  return inc;
}

const genIncStatus = (update) => {
  let inc_status = Object.assign({}, incident_status)
  let statuses = ['pending', 'active', 'closed', 'cancelled', 'filed']
  let statusesToGen = getRandomIntInclusive(1, 5)
  // generate timestamps for random properties
  for (var i = 0; i < statusesToGen; i++) {
      let currStatus = statuses[i]
      if (update) {
        inc_status[currStatus] = faker.date.recent(1)
      } else {
        inc_status[currStatus] = faker.date.recent(2)
      }
  }
  // set all properties without timestamps to null
  for (var key in inc_status) {
    if (inc_status[key] === '') inc_status[key] = null
  }

  return inc_status
}

const genIncRemark = () => {
  let inc_remark = Object.assign({}, incident_remark)

  inc_remark.remark = faker.company.catchPhrase().toUpperCase()

  return inc_remark
}

const genIncAssignment = async (deptId) => {
  let apps = await appCtrl.getAllAppsByDeptId(deptId)
  let appArr = apps.map(app => app.app_abbr)
  let output = ''
  let outputLen = getRandomIntInclusive(0, appArr.length - 1)

  for (var i = 0; i < outputLen; i++) {
    let appIdx = getRandomIntInclusive(0, appArr.length - 1)

    if (output.length !== 0) {
      output = output + " " + appArr[appIdx]
    } else {
      output = output + " " + appArr[appIdx]
    }

    appArr = appArr.filter( (el, idx) => {
      if (idx !== appIdx) return el
    })
  }
  
  return {assignment: appArr.toString()}
}


module.exports = {
  genIncident      : genIncident,
  genIncRemark     : genIncRemark,
  genIncStatus     : genIncStatus,
  genIncAssignment : genIncAssignment
}
