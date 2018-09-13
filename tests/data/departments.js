//https://github.com/marak/Faker.js/
var faker = require('faker');

let department = {
    'dept_name' : '',
    'dept_abbr' : '',
    'dept_head' : '',
    'dept_ip'   : ''
}

const genAbbreviation = (deptName) => {
  // deptName is at least 3 words
  let abbr = ''
  let name = deptName.toUpperCase().slice(0).split(' ')
  // if dept name is one word (excluding 'fire department')
  if (name.length === 3) {
    abbr = name[0].slice(0, 4)
  } else if (name.length === 4) {
    abbr = name[0][0] + name[1].slice(0, 3)
  } else if (name.length > 4) {
    abbr = name[0][0] + name[1][0] + name[2][0]
  } else {
    abbr = name[0].slice(0, name[0].length - 1)
  }

  return abbr
}

const genDepartment = () => {


  let dept = Object.assign({}, department)
  let deptCity = faker.address.city()

  dept.dept_name   = deptCity + ' Fire Department'
  dept.dept_abbr   = genAbbreviation(dept.dept_name)
  dept.dept_head   = faker.name.findName()
  dept.dept_ip     = faker.internet.ip()
  dept.dept_city   = deptCity
  dept.dept_state  = faker.address.state()
  dept.dept_zip    = faker.address.zipCode()
  dept.dept_county = faker.address.county()

  return dept;
}


module.exports = {genDepartment: genDepartment}
