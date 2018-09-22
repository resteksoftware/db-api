let server = require('../../app');
let request = require('supertest');
let should = require('chai').should()
let expect = require('chai').expect
let data = require('../data')
let DEBUG = require('../../logconfig').tests.routes.responses

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

describe('API/RESPONSES', function() {

  let carriers;
  let userIds = new Set();
  let department = data.dept.genDepartment();
  let deptId;
  let stations = data.sta.genStations(10);
  let staIds = new Set();
  let apps = [];
  let appIds = new Set();
  let trackUserDeptIds = new Set(); 
  let incident;
  let incidentRemark;
  let incidentStatus;
  let incidentAssignment;
  let incId;
  let incStatusId;
  let incRemarkId;
  let incAssignmentId;
  let respUserId;
  let respAppId;

  before(function(done) {
      // fetch carriers
      request(server)
        .get('/api/carriers')
        .expect(200)
        .end(function(err, res) {
          // store carriers to be accessed for user creation
          carriers = res.body
          // post dept
          request(server)
          .post(`/api/departments`)
          .send(department)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.property('dept_id').that.is.a('number')
            deptId = res.body.dept_id
            if (DEBUG) console.log(`👉 Generated dept_id: ${deptId}`);
            // set deptId for each station
            stations.forEach(sta => sta.dept_id = deptId)
            // post stations
            request(server)
            .post(`/api/stations/`)
            .send(stations)
            .expect(200)
            .end(function(err, res) {
              expect(res.body).to.have.property('data').that.is.a('string')
              expect(res.body).to.deep.equal({data: 'success'})
              // fetch stations stored to retrieve sta_id
              request(server)
              .get(`/api/stations/${deptId}`)
              .expect(200)
              .end(function(err, res) {
                expect(res.body).to.be.an('array')
                // store sta_ids to staIds set
                res.body.forEach(sta => staIds.add(sta.sta_id))
                // convert staId set to array
                let staIdArr = [...staIds]
                if (DEBUG) console.log(`👉 Generated sta_id: ${JSON.stringify(staIdArr)}`);
                // declare rand num of apps to generate
                let numApps = getRandomIntInclusive(20, 50)
                for (var i = 0; i < numApps; i ++) {
                  // grab rand sta_id for app association
                  let randStaIdx = getRandomIntInclusive(0, staIdArr.length - 1)
                  let randStaId = staIdArr[randStaIdx]
                  // generate random app
                  let app = data.app.genApparatusCollection(randStaId, 1)[0]
                  // add app to collection
                  apps.push(app)
                }
                request(server)
                .post(`/api/apparatus/`)
                .send(apps)
                .expect(200)
                .end(function(err, res) {
                  expect(res.body).to.have.property('data').that.is.a('string')
                  expect(res.body).to.deep.equal({data: 'success'})
                  // fetch all apps stored to retrieve app_id
                  request(server)
                  .get(`/api/apparatus/${deptId}`)
                  .expect(200)
                  .end(function(err, res) {
                    expect(res.body).to.be.an('array')
                    // store app_ids to appIds set
                    res.body.forEach(app => appIds.add(app.app_id))
                    if (DEBUG) console.log(`👉 Generated app_id: ${JSON.stringify([...appIds])}`);
                    // create and store users
                    let numUsers = getRandomIntInclusive(3, 20)
                    let users = []
                    // generate random number of users
                    for (var i = 0; i < numUsers; i++) {
                      let staIdArr = [...staIds]
                      let randStaIdx = getRandomIntInclusive(0, staIdArr.length - 1)
                      // set default station as random station in dept
                      let defaultStation = staIdArr[randStaIdx]
                      // set carrierId as random carrier from carriers
                      let carrierId = carriers[getRandomIntInclusive(0, carriers.length - 1)].carrier_id
                      // generate random user with above credentials
                      let user = data.user.genUser(carrierId, defaultStation)
                      users.push(user)
                    }

                    let bodyDetails = {
                      user: users,
                      dept_id: deptId
                    }

                    request(server)
                    .post(`/api/users`)
                    .send(bodyDetails)
                    .expect(200)
                    .end(function (err, res) {
                      if (err) console.log(err);
                      expect(res.body).to.have.property('user_id').that.is.a('array')
                      expect(res.body).to.have.property('track_id').that.is.a('array')
                      if (DEBUG) console.log(`👉 Generated user_ids: ${res.body.user_id}`)
                      if (DEBUG) console.log(`👉 Generated user_dept_ids: ${res.body.track_id}`)
                      res.body.user_id.forEach(id => userIds.add(id))
                      res.body.track_id.forEach(id => trackUserDeptIds.add(id))
                    
                      // post an incident
                        incident = data.inc.genIncident()
                        incidentRemark = data.inc.genIncRemark()
                        incidentStatus = data.inc.genIncStatus()
                        incidentAssignment = { assignment: [...appIds].toString() }

                        let body = {
                          dept_id: deptId,
                          data: {
                            inc: incident,
                            incStatus: incidentStatus,
                            incRemark: incidentRemark,
                            incAssignment: incidentAssignment
                          }
                        }

                        request(server)
                        .post(`/api/incidents/new`)
                        .send(body)
                        .expect(200)
                        .end(function (err, res) {
                          if (err) console.log(err);
                          expect(res.body).to.have.property('inc_id').to.be.a('number')
                          expect(res.body).to.have.property('inc_status_id').to.be.a('number')
                          expect(res.body).to.have.property('inc_remark_id').to.be.a('number')
                          expect(res.body).to.have.property('inc_assignment_id').to.be.a('number')
                          incId = res.body.inc_id
                          incStatusId = res.body.inc_status_id
                          incRemarkId = res.body.inc_remark_id
                          incAssignmentId = res.body.inc_assignment_id                          
                          done()
                        })

                    })
                  })
                })
              })
            })
          })
        })
  })

  describe('POST "/:userOrApp"', function(done) {

    it('should post a response for a user', function(done) {  
      let userResponse = data.resp.genRespUser([...userIds][0], incId)
      request(server)
      .post('/api/responses/user')
      .send(userResponse)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        if (DEBUG) console.log(`👉 [TEST] POST API/RESPONSES/USER, \n: body: ${JSON.stringify(res.body, null, 2)}`);
        expect(res.body).to.have.property('resp_user_id').that.is.a('number')
        done()
      })
      
    })    
    
    it('should post a response for an apparatus', function(done) {
      let appResponse = data.resp.genRespApp([...appIds][0], incId)
      request(server)
      .post('/api/responses/apparatus')
      .send(appResponse)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        if (DEBUG) console.log(`👉 [TEST] POST API/RESPONSES/APPARATUS, \n: body: ${JSON.stringify(res.body, null, 2)}`);
        expect(res.body).to.have.property('resp_app_id').that.is.a('number')
        done()
      })
      
    })    
  });


  describe('GET "/"', function(done) {
    it('should get all responses for one user', function(done) {
      let userId = [...userIds][0]
      if (DEBUG) console.log(`👉 [TEST] GET API/RESPONSES user_id: ${userId}`)
      request(server)
      .get(`/api/responses/user-id/${userId}`)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.have.property('data')
        done()
      })
    })

    it('should get all responses for one apparatus', function(done) {
      let appId = [...appIds][0]
      request(server)
      .get(`/api/responses/app-id/${appId}`)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.have.property('data')
        done()
      })
    })

    it('should get all responses for one incident', function(done) {
      request(server)
      .get(`/api/responses/inc-id/${incId}`)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.have.property('resp_user')
        expect(res.body).to.have.property('resp_app')
        respUserId = res.body.resp_user[0].resp_user_id
        respAppId = res.body.resp_app[0].resp_app_id
        
        done()
      })
    })

  })

  describe('PATCH "/:userOrApp"', function(done) {
    it('should update a user response', function(done) {
      let userUpdate = data.resp.genRespUpdate()
      request(server)
      .patch(`/api/responses/user/${respUserId}`)
      .send(userUpdate)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body[0]).to.have.property('onscene_resp_gps').that.is.a('string')
        done()
      })
    })

    it('should update an apparatus response', function(done) {
      let appUpdate = data.resp.genRespUpdate()
      request(server)
      .patch(`/api/responses/apparatus/${respAppId}`)
      .send(appUpdate)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body[0]).to.have.property('onscene_resp_gps').that.is.a('string')
        done()
      })
    })
  })

  describe('DELETE "/"', function(done) {
    it('should delete a user response', function(done) {
      request(server)
      .delete(`/api/responses/user/${respUserId}`)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.have.property('data').that.is.a('string')
        expect(res.body.data).to.equal('user response was successfully deleted')
        done()
      })
    })

    it('should not fetch deleted response', function(done) {
      request(server)
      .get(`/api/responses/user-id/${[...userIds][0]}`)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body.data).to.deep.equal(null)
        done()
      })
    })

    it('should delete an apparatus response', function(done) {
      request(server)
      .delete(`/api/responses/apparatus/${respAppId}`)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.have.property('data').that.is.a('string')
        expect(res.body.data).to.equal('apparatus response was successfully deleted')
        done()
      })
    })

    it('should not fetch deleted apparatus response', function(done) {
      request(server)
      .get(`/api/responses/user-id/${[...userIds][0]}`)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body.data).to.deep.equal(null)
        done()
      })
    })
  })


  after(function(done) {
    let usersToDelete = [...userIds]

    request(server)
    .delete(`/api/incidents/${incId}`)
    .expect(200)
    .end(function (err, res) {
      if (err) console.log(err)
      expect(res.body.data).equals('incident was successfully deleted')
      request(server)
      .delete(`/api/users/bulk`)
      .send({ user_id: usersToDelete })
      .expect(200)
      .end(function (err, res) {
        if (err) console.log(err);
        expect(res.body.data).to.equal('user delete successful')
        request(server)
        .delete(`/api/departments/${deptId}`)
        .expect(200)
        .end(function (err, res) {
          if (err) console.log(err);
          expect(res.body).to.have.property('data').that.is.a('string')
          expect(res.body.data).to.equal('department and all associated stations/apparatus have been deleted')
          done()
        })

      })
    })
  })



    // let carriers;
    // let userIds = new Set();
    // let department = data.dept.genDepartment();
    // let deptId;
    // let stations = data.sta.genStations(10);
    // let staIds = new Set();
    // let apps = [];
    // let appIds = new Set();
    // let trackUserDeptIds = new Set();
    // let incident;
    // let incidentRemark;
    // let incidentStatus;
    // let incidentAssignment;
    // let incId;
    // let incStatusId;
    // let incRemarkId;
    // let incAssignmentId;
    // let respUserId;
    // let respAppId;
   }) 


