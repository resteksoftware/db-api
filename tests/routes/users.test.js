let server = require('../../app');
let request = require('supertest');
// let session = require('supertest-session');
// let testSession = session(server);
let should = require('chai').should()
let expect = require('chai').expect
let data = require('../data')
let DEBUG = require('../../logconfig').tests.routes.users

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

describe('API/USERS', function() {

  let carriers;
  let userId;
  let userIds = new Set();
  let department = data.dept.genDepartment();
  let deptId;
  let stations = data.sta.genStations(10);
  let staIds = new Set();
  let staId;
  let apps = [];
  let appIds = new Set();
  let appId;
  let trackUserDeptIds = new Set();
  let trackUserStaIds = new Set();
  let trackUserAppIds = new Set();
  let randAppIdx;
  let randStaIdx;

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
                    done()
                  })
                })
              })
            })
          })
        })
  })

  describe('POST "/:deptId"', function(done) {

    it('should post a new user', function (done) {

        let staIdArr = [...staIds]
        let randStaIdx = getRandomIntInclusive(0, staIdArr.length - 1)
        // set default station as random station in dept
        let defaultStation = staIdArr[randStaIdx]
        // set carrierId as random carrier from carriers
        let carrierId = carriers[getRandomIntInclusive(0, carriers.length - 1)].carrier_id
        // generate random user with above credentials
        let user = data.user.genUser(carrierId, defaultStation)

        let bodyDetails = {
          user: user,
          dept_id: deptId
        }

        request(server)
        .post(`/api/users`)
        .send(bodyDetails)
        .expect(200)
        .end(function(err, res) {
          if (err) console.log(err);
          userIds.add(res.body.user_id)
          trackUserDeptIds.add(res.body.track_id)
          if (DEBUG) console.log(`👉 Generated user_id: ${res.body.user_id}`)
          if (DEBUG) console.log(`👉 Generated user_dept_id: ${res.body.track_id}`)
          expect(res.body).to.have.property('user_id').that.is.a('number')
          expect(res.body).to.have.property('track_id').that.is.a('number')
          done()
        })
  

    });

    it('should post multiple users', function (done) {

 
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
            .end(function(err, res) {
              if (err) console.log(err);
              expect(res.body).to.have.property('user_id').that.is.a('array')
              expect(res.body).to.have.property('track_id').that.is.a('array')
              if (DEBUG) console.log(`👉 Generated user_ids: ${res.body.user_id}`)
              if (DEBUG) console.log(`👉 Generated user_dept_ids: ${res.body.track_id}`)
              res.body.user_id.forEach(id => userIds.add(id) )
              res.body.track_id.forEach(id => trackUserDeptIds.add(id) )
              done()
            })
        })


    });


  


    describe('POST "/track"', function(done) {

      it('should associate a user to a station', function (done) {

        let staIdArr = [...staIds]
        randStaIdx = getRandomIntInclusive(0, staIdArr.length - 1)
        let userIdArr = [...userIds]
        staId = staIdArr[randStaIdx]

        let bodyDetails = {
          sta_id: staId,
          user_id: userIdArr[0]
        }


        request(server)
        .post(`/api/users/track`)
        .send(bodyDetails)
        .expect(200)
        .end(function(err, res) {
          if (err) console.log(err);
          trackUserStaIds.add(res.body.track_id)
          if (DEBUG) console.log(`👉 Generated user_sta_id: ${res.body.track_id}`)
          expect(res.body).to.have.property('track_id').that.is.a('number')
          done()
        })
        
      });

      it('should associate a user to an apparatus', function (done) {

        let appIdArr = [...appIds]
        randAppIdx = getRandomIntInclusive(0, appIdArr.length - 1)
        let userIdArr = [...userIds]
        appId = appIdArr[randAppIdx]

        let bodyDetails = {
          app_id: appId,
          user_id: userIdArr[0]
        }
    
        request(server)
          .post(`/api/users/track`)
          .send(bodyDetails)
          .expect(200)
          .end(function(err, res) {
            if (err) console.log(err);
            trackUserAppIds.add(res.body.track_id)
            if (DEBUG) console.log(`👉 Generated user_app_id: ${res.body.track_id}`)
            expect(res.body).to.have.property('track_id').that.is.a('number')
            done()
          })
      
      });


    });

  describe('GET "/"', function(done) {

    it('should get users matching department_id', function (done) {
      let bodyDetails = {dept_id: deptId}

       request(server)
          .get(`/api/users/`)
          .send(bodyDetails)
          .expect(200)
          .end(function(err, res) {
            if (err) console.log(err);
            expect(res.body).to.be.an('array')
            res.body.forEach(user => {
              // verify all properties of returned user
              expect(user).to.have.property('user_id').that.is.a('number')
              expect(user).to.have.property('first_name').that.is.a('string')
              expect(user).to.have.property('last_name').that.is.a('string')
              expect(user).to.have.property('mobile_num').that.is.a('string')
              expect(user).to.have.property('carrier_id').that.is.a('number')
              expect(user).to.have.property('email').that.is.a('string')
              expect(user).to.have.property('device_os').that.is.a('string')
              expect(user).to.have.property('rank').that.is.a('string')
              expect(user).to.have.property('default_station').that.is.a('number')
              expect(user).to.have.property('is_driver').that.is.a('boolean')
              expect(user).to.have.property('is_enabled').that.is.a('boolean')
              expect(user).to.have.property('is_sleeping').that.is.a('boolean')
              expect(user).to.have.property('is_admin').that.is.a('boolean')
              expect(user).to.have.property('is_deleted').that.is.a('boolean')
              expect(user).to.have.property('is_career').that.is.a('boolean')
              expect(user).to.have.property('is_volley').that.is.a('boolean')
              expect(user).to.have.property('created_at').that.is.a('string')
              expect(user).to.have.property('updated_at').that.is.a('string')

              // verify that user returned is a user that was added
              expect(userIds).to.include(user.user_id)
            })

            done()
          })
      })

      it('should get users matching sta_id', function(done) {
        let bodyDetails = { sta_id: staId }
        let userIdArr = [...userIds]

        request(server)
        .get(`/api/users/`)
        .send(bodyDetails)
        .expect(200)
        .end(function(err, res) {
          if (err) console.log(err)
          expect(res.body).to.be.an('array')
          expect(res.body[0]).to.have.property('user_id').that.is.a('number')
          expect(staId).to.equal(res.body[0].sta_id)
          expect(userIdArr[0]).to.equal(res.body[0].user_id)
          done()
        })
      })

      it('should get users matching app_id', function(done) {
        let bodyDetails = { app_id: appId }
        let userIdArr = [...userIds]

        request(server)
        .get(`/api/users/`)
        .send(bodyDetails)
        .expect(200)
        .end(function(err, res) {
          if (err) console.log(err)
          expect(res.body).to.be.an('array')
          expect(res.body[0]).to.have.property('user_id').that.is.a('number')
          expect(appId).to.equal(res.body[0].app_id)
          expect(userIdArr[0]).to.equal(res.body[0].user_id)
          done()
        })
      })

      it('should get users matching app_id', function(done) {
        let bodyDetails = { app_id: appId }
        let userIdArr = [...userIds]

        request(server)
        .get(`/api/users/`)
        .send(bodyDetails)
        .expect(200)
        .end(function(err, res) {
          if (err) console.log(err)
          expect(res.body).to.be.an('array')
          expect(res.body[0]).to.have.property('user_id').that.is.a('number')
          expect(appId).to.equal(res.body[0].app_id)
          expect(userIdArr[0]).to.equal(res.body[0].user_id)
          done()
        })
      })

    })

    describe('GET "/track', function(done) {
      it('should get all tracks based off user id', function (done) {
        
        let userIdArr = [...userIds] 

        request(server)
          .get(`/api/users/track/${userIdArr[0]}`)
          .expect(200)
          .end(function (err, res) {
            if (err) console.log(err)
            if (DEBUG) console.log(`👉 [TEST] GET '/track' \nbody: ${JSON.stringify(res.body, null, 2)}`);
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('track_user_app').that.is.a('array')
            expect(res.body).to.have.property('track_user_sta').that.is.a('array')
            expect(res.body).to.have.property('track_user_dept').that.is.a('array')
            done()
          })
      })
    })

    describe('PATCH "/:userId"', function(done) {
      let userIdsToDelete;

      it('should update a user', function(done) {
        let userUpdate = { first_name: 'Updated' }
        let userIdArr = [...userIds]

        request(server)
        .patch(`/api/users/${userIdArr[0]}`)
        .send(userUpdate)
        .expect(200)
        .end(function(err, res) {
          if (err) console.log(err)
          expect(res.body).to.be.an('object')
          expect(res.body.first_name).to.equal('Updated')
          done()
        })
      })
    })

    describe('DELETE "/:userId"', function(done) {
      let usrIdx
      it('should delete a user', function(done) {
        let userIdArr = [...userIds]
        let userIdToDelete = userIdArr[0]
        usrIdx = userIdArr[0]
        request(server)
        .delete(`/api/users/${userIdToDelete}`)
        .expect(200)
        .end(function(err, res) {
          if (err) console.log(err)
          expect(res.body).to.have.property('data').that.is.a('string')
          expect(res.body.data).to.equal('user delete successful')
          done()
        })
      })

      it('should fail to retrieve deleted user', function(done) {
        request(server)
        .get(`/api/users/`)
        .send({user_id: usrIdx})
        .expect(400)
        .end(function(err, res) {
          expect(res.body).to.deep.equal([])
          done()
        })
      })

      it('should delete multiple users', function (done) {
        userIdToDelete = [...userIds].slice(0,3)
        request(server)
          .delete(`/api/users/bulk`)
          .send({user_id: userIdToDelete})
          .expect(200)
          .end(function (err, res) {
            if (err) console.log(err)
            expect(res.body).to.have.property('data').that.is.a('string')
            expect(res.body.data).to.equal('user delete successful')
            done()
          })
      })


      it('should fail to retrieve deleted user', function (done) {
        request(server)
        .get(`/api/users/`)
        .send({ user_id: userIdToDelete[0] })
        .expect(400)
        .end(function (err, res) {
          expect(res.body).to.deep.equal([])
          request(server)
          .get(`/api/users/`)
          .send({ user_id: userIdToDelete[1] })
          .expect(400)
          .end(function (err, res) {
            if (DEBUG) console.log('👉 Deleting ', userIdToDelete);
            expect(res.body).to.deep.equal([])
            done()
          })
        })
      })

    })

    describe('DELETE "/track', function(done) {

      it('should delete an association between a user and apparatus', function (done) {
        let appIdArr = [...appIds]
        let body = {
          user_id: [...userIds][0],
          app_id: appIdArr[randAppIdx]
        }

        request(server)
          .delete(`/api/users/track`)
          .send(body)
          .expect(200)
          .end(function (err, res) {
            if (err) console.log(err);
            expect(res.body.data).to.equal('association deleted between apparatus and user')
            done()
          })
      })

      it('should delete an association between a user and station', function (done) {
        let staIdArr = [...staIds]
        let body = {
          user_id: [...userIds][0],
          sta_id: staIdArr[randStaIdx]
        }

        request(server)
        .delete(`/api/users/track`)
        .send(body)
        .expect(200)
        .end(function (err, res) {
          if (err) console.log(err);
          expect(res.body.data).to.equal('association deleted between station and user')
          done()
        })
      })

      it('should delete an association between a user and department', function (done) {
        let body = {
          user_id: [...userIds][0],
          dept_id: deptId
        }

        request(server)
        .delete(`/api/users/track`)
        .send(body)
        .expect(200)
        .end(function (err, res) {
          if (err) console.log(err);
          expect(res.body.data).to.equal('association deleted between department and user')
          done()
        })
      })

    }) 

   after(function(done) {
     let usersToDelete = [];
     // fetch all users created under dept
     request(server)
     .get(`/api/users/`)
     .send({dept_id: deptId})
     .expect(200)
     .end(function (err, res) {
       if (err) console.log(err);       
       res.body.forEach(usr => usersToDelete.push(usr.user_id))
       if (DEBUG) console.log('👉 Deleting user_id:', usersToDelete);
       // delete all users and track associations
       request(server)
       .delete(`/api/users/bulk`)
       .send({user_id: usersToDelete})
       .expect(200)
       .end(function (err, res) {
          if (err) console.log(err);
          expect(res.body.data).to.equal('user delete successful')
          request(server)
          .delete(`/api/departments/${deptId}`)
          .expect(200)
          .end(function (err, res) {       
            if (err) console.log(err);
    
            expect(res.body.data).to.equal('department and all associated stations/apparatus have been deleted')
            done() 
          })
        })


       })
       
     }) 

});
