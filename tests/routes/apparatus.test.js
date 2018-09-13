let server = require('../../app');
let request = require('supertest');
// let session = require('supertest-session');
// let testSession = session(server);
let should = require('chai').should()
let expect = require('chai').expect
let data = require('../data')
let DEBUG = require('../../logconfig').tests.routes.apparatus

describe('API/APPARATUS', function() {

  let deptId = ''
  let staId = ''
  let appIds = new Set()
  let appIdsToDelete = []
  // create one new department and store dept_id as deptId
  before(function(done) {
    let dept = data.dept.genDepartment()
    let sta = data.sta.genStations(1)[0]
    
    // post a new department and get dept_id returned
    request(server)
    .post('/api/departments')
    .send(dept)
    .end(function(err, res) {
      // store dept_id for future use and deletion
      deptId = res.body.dept_id
      // add dept_id to sta
      sta.dept_id = deptId
      if (DEBUG) console.log(`👉 Generated dept_id: ${deptId}`);
      // post a new station under department
      request(server)
      .post(`/api/stations`)
      .send(sta)
      .end(function(err, resp) {
        // store sta_id for future use and deletion
        staId = resp.body.sta_id
        if (DEBUG) console.log(`👉 Generated sta_id: ${staId}`);
        done()
      })
    })
  })
  
  describe('POST "/"', function(done){
    
    it('should post an apparatus', function (done) {
      let app =  data.app.genApparatusCollection(staId, 1)[0]
      request(server)
      .post(`/api/apparatus/`)
      .send(app)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        appIds.add(res.body.app_id)
        expect(res.body).to.have.property('app_id').that.is.a('number')
        done()
      })
    })
    
    it('should post multiple apparatus', function (done) {
      let apps = data.app.genApparatusCollection(staId, 10)
      request(server)
      .post(`/api/apparatus/`)
      .send(apps)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.have.property('data').that.is.a('string')
        expect(res.body).to.deep.equal({data: 'success'})
        done()
      })
    })
    
  });
  
  describe('GET "/:deptId/:staId"', function(done){
    
    it('should get all apparatus using dept_id and sta_id', function (done) {
      request(server)
      .get(`/api/apparatus/${deptId}/${staId}`)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.be.an('array')
        res.body.forEach(app => {
          expect(app).to.have.property('app_id').that.is.a('number')
          expect(app).to.have.property('sta_id').that.is.a('number')
          expect(app).to.have.property('app_abbr').that.is.a('string')
          expect(app).to.have.property('app_name').that.is.a('string')
          expect(app).to.have.property('is_enabled').that.is.a('boolean')
          expect(app).to.have.property('created_at').that.is.a('string')
          expect(app).to.have.property('updated_at').that.is.a('string')
          
          // collect all apps from fake department/station combo for deletion
          appIds.add(app.app_id)
        })
        if (DEBUG) console.log(`👉 Generated app_id: ${JSON.stringify([...appIds])}`);
        
        done()
      })
    })
  })

  describe('PATCH "/:appId"', function(done) {

    it('should update an apparatus using app_id', function(done) {
      let appIdArr = [...appIds]
      let appUpdate = {app_name: 'UpdatedApp'}

      request(server)
      .patch(`/api/apparatus/${appIdArr[0]}`)
      .send(appUpdate)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.be.an('array')
        expect(res.body[0].app_name).to.equal('UpdatedApp')
        done()
      })
    })
  })

  describe('DELETE "/"', function(done) {

    it('should delete a single apparatus', function(done) {
      let singleDelete = [...appIds].slice(0,1)
      appIdsToDelete = [...appIds].slice(6)
      request(server)
      .delete(`/api/apparatus/`)
      .send({data: singleDelete})
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.have.property('data').that.is.a('string')
        expect(res.body.data).to.equal('apparatus was successfully deleted')
        done()
      })
    })

    it('should not find deleted apparatus from single deletion', function(done) {
      let singleDelete = [...appIds].slice(0, 1)[0]
      let appIdArr = [...appIds]
      appIds.delete(appIdArr[0])
      appIdsToDelete = appIdArr.slice(1)
      request(server)
      .get(`/api/apparatus/${deptId}/${staId}`)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.be.an('array').that.does.not.include(singleDelete)
        done()
      })
    })

    it('should bulk delete an apparatus array of app_id', function(done) {
      let bulkDelete = [...appIds].slice(1,6)
      appIdsToDelete = [...appIds].slice(6)
      request(server)
      .delete(`/api/apparatus/`)
      .send({data: bulkDelete})
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.have.property('data').that.is.a('string')
        expect(res.body.data).to.equal('apparatus was successfully deleted')
        done()
      })
    })

    it('should not find deleted apparatus from bulk deletion', function(done) {
      let bulkDelete = [...appIds].slice(1,6)
      request(server)
      .get(`/api/apparatus/${deptId}/${staId}`)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        res.body.forEach( app => {
          expect(bulkDelete).to.be.an('array').that.does.not.include(app.app_id)
        })
        done()
      })
    })

  })

  after(function(done){
  // remove remaining apparatus    
    request(server)
    .delete(`/api/departments/${deptId}`)
    .end(function(err, res) {
      expect(res.body.data).to.equal('department and all associated stations/apparatus have been deleted')
      let didDelete = (DEBUG && res.body.data === 'department and all associated stations/apparatus have been deleted')
      if (didDelete) console.log(`👉 Dept ${deptId} and associated stations/apparatus have been deleted`);
      done()
    })
  })
  
})