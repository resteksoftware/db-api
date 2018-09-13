//https://github.com/marak/Faker.js/
var faker = require('faker');

let ranks = [
  'Volunteer firefighter',
  'Probationary firefighter',
  'Firefighter/EMT',
  'Firefighter/Paramedic',
  'Driver Engineer',
  'Lieutenant',
  'Captain',
  'Battalion Chief',
  'Assistant Chief',
  'Fire Chief'
]

let userTemplate = {
    "first_name"  : '',
    "last_name"   : '',
    "mobile_num"  : '',
    // needs carrier_id
    "email"       : '',
    "device_os"   : '',
    "rank"        : 'firefighter',
    // needs default_station id
    "is_driver"   : false,
    "is_enabled"  : true,
    "is_sleeping" : false,
    "is_admin"    : true,
    "is_deleted"  : false,
    "is_career"   : true,
    "is_volley"   : false
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const genUser = (carrierId, defaultStationId) => {
  let user = Object.assign({}, userTemplate)

  user.first_name      = faker.name.firstName()
  user.last_name       = faker.name.lastName()
  user.mobile_num      = faker.phone.phoneNumber('##########')
  user.carrier_id      = carrierId
  user.email           = faker.internet.email()
  user.default_station = defaultStationId
  user.device_os       = ['android', 'ios'][getRandomIntInclusive(0,1)]
  user.rank            = ranks[getRandomIntInclusive(0, ranks.length - 1)]
  user.is_driver       = [true, false][getRandomIntInclusive(0,1)]
  user.is_enabled      = [true, false][getRandomIntInclusive(0,1)]
  user.is_sleeping     = [true, false][getRandomIntInclusive(0,1)]
  user.is_admin        = [true, false][getRandomIntInclusive(0,1)]
  user.is_deleted      = [true, false][getRandomIntInclusive(0,1)]
  user.is_career       = [true, false][getRandomIntInclusive(0,1)]
  user.is_volley       = [true, false][getRandomIntInclusive(0,1)]

  return user
}


module.exports = {genUser: genUser}
