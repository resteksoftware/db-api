const msg = `first, be sure to run: psql -h dispatchresponse.cyqnwvgizc2j.us-east-1.rds.amazonaws.com -U webapplogin smrtfire < /Users/nicholasfreeman/Documents/08-apps/dr/db-api/scripts/db_create/create_db.sql && node /Users/nicholasfreeman/Documents/08-apps/dr/db-api/scripts/db_seed/insert_carriers.js`
const data = require('../../tests/data')
const axios = require('axios')
const DEBUG = true;

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const seedMockDept = async () => {
  // create a dept
  let dept = data.dept.genDepartment()
  if (DEBUG) console.log(`👉 Dept generated: \n${JSON.stringify(dept, null, 2)}`);
  let deptId = await axios.post('http://localhost:8080/api/departments', dept).then( res => res.data.dept_id)
  if (DEBUG) console.log(`👉 deptId returned: ${deptId}`);
  // create rand num stations
  let stas = data.sta.genStations(10, deptId)
  console.log(stas.length);
  console.log(stas);
  
  if (DEBUG) console.log(`👉 (10) Stations generated.`);
  await axios.post('http://localhost:8080/api/stations', stas)
  let staIds = await axios.get(`http://localhost:8080/api/stations/${deptId}`).then(res => res.data.map(sta => sta.sta_id))
  
  if (DEBUG) console.log(`👉 staIds returned: ${staIds}`);
  // create 4 apparatus per station
  for (var i = 0; i < staIds.length; i++) {
    let apps = data.app.genApparatusCollection(staIds[i], 4)
    if (DEBUG) console.log(`👉 generated (4) apps: \n${apps}`);
    await axios({
      method: 'post',
      url: 'http://localhost:8080/api/apparatus',
      data: apps
    })
  }
  // get appIds 
  let appIds = await axios.get(`http://localhost:8080/api/apparatus/${deptId}`).then(res => res.data.map(app => app.app_id))
  if (DEBUG) console.log(`👉 appIds returned: \n${JSON.stringify(appIds, null, 2)}`);
  // get carrier_ids
  let carriers = await axios({
    method: 'get',
    url: 'http://localhost:8080/api/carriers'
  }).then(res => res.data)
  // create 50 users & associate to dept
  let users = [];
  for( var i = 0; i < 50; i++) {
    let tmpIdx = getRandomIntInclusive(0, carriers.length - 1)
    let carrierId = carriers[tmpIdx].carrier_id
    tmpIdx = getRandomIntInclusive(0, staIds.length - 1)
    let defaultStaId = staIds[tmpIdx]
    let user = data.user.genUser(carrierId, defaultStaId)
    users.push(user)
  } 
  if (DEBUG) console.log(`👉 generated (50) users. first element: \n${JSON.stringify(users[0], null, 2)}`);
  await axios({
    method: 'post',
    url: 'http://localhost:8080/api/users',
    data: { 
      user: users,
      dept_id: deptId
     }
  })
  let userIds = await axios({
    method: 'get',
    url: 'http://localhost:8080/api/users/', 
    data: { dept_id: deptId }
}).then(res => res.data.map(user => user.user_id))
  if (DEBUG) console.log(`👉 userIds returned: \n${JSON.stringify(userIds, null, 2)}`);
  // associate 1 user to default station
  for (var i = 0; i < users.length; i ++) {
    let userStaId = users[i].default_station
    let userId = userIds[i]
    if (DEBUG) console.log(`user_id: ${userId} , sta_id: ${parseInt(userStaId)}`);
    
    await axios({
      method: 'post',
      url: 'http://localhost:8080/api/users/track',
      data: {
        user_id: userId,
        sta_id: parseInt(userStaId)
      }
    })
  }
  if (DEBUG) console.log(`👉 users are tracking their default station`);
  if (DEBUG) console.log(`👉 Generating (100) incidents for Dept: ${deptId}`);
  // generate many incidents
  for (var i = 0; i < 100; i++) {
    // create a remark
    let incidentRemark = data.inc.genIncRemark()
    // create an incident status
    let incidentStatus = data.inc.genIncStatus()
    // create an assignment
    let incidentAssignment = await data.inc.genIncAssignment(deptId)
    // create an incident (related to dept_id)
    let incident = data.inc.genIncident()

    let body = {
      formatted: {
        inc: incident,
        incStatus: incidentStatus,
        incRemark: incidentRemark,
        incAssignment: incidentAssignment
      }
    }
    
    await axios({
      method: 'post',
      url: `http://localhost:8080/api/incidents/${deptId}`,
      data: body
    })

  }
  if (DEBUG) console.log(`👉 incidents posted`);
  console.log('🏄 done.')
}

seedMockDept()