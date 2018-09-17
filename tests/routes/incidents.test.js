let server = require('../../app');
let request = require('supertest');
let should = require('chai').should()
let expect = require('chai').expect
let data = require('../data')
let DEBUG = require('../../logconfig').tests.routes.incidents

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

describe('API/INCIDENTS', function() {
  let dept = data.dept.genDepartment()
  let stations = data.sta.genStations(10);
  let apps = [];
  let deptId;
  let staIds = new Set();
  let appIds = new Set();
  let incId = '';
  let incStatusId = '';
  let incRemarkId = '';
  let incAssignmentId = '';
  let incident;
  let incidentRemark;
  let incidentStatus;
  let incidentAssignment;

  before(function(done) {
    // generate a random department and populate with random stations/apparatus combos
    // store all ids in global scope for deletion after tests
    request(server)
    .post(`/api/departments/`)
    .send(dept)
    .expect(200)
    .end(function (err, res) {
      if (err) console.log(err);
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
      .end(function (err, res) {
        expect(res.body).to.have.property('data').that.is.a('string')
        expect(res.body).to.deep.equal({ data: 'success' })
        // fetch stations stored to retrieve sta_id
        request(server)
        .get(`/api/stations/${deptId}`)
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.be.an('array')
          // store sta_ids to staIds set
          res.body.forEach(sta => staIds.add(sta.sta_id))
          // convert staId set to array
          let staIdArr = [...staIds]
          if (DEBUG) console.log(`👉 Generated sta_id: ${JSON.stringify(staIdArr)}`);
          // declare rand num of apps to generate
          let numApps = getRandomIntInclusive(20, 50)
          for (var i = 0; i < numApps; i++) {
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
          .end(function (err, res) {
            expect(res.body).to.have.property('data').that.is.a('string')
            expect(res.body).to.deep.equal({ data: 'success' })
            // fetch all apps stored to retrieve app_id
            request(server)
            .get(`/api/apparatus/${deptId}`)
            .expect(200)
            .end(function (err, res) {
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

  describe('POST "/:incType', function (done) {

    it('should post an incident and return users relevant to incident', function (done) {

      (async function() {
        incident = data.inc.genIncident()
        incidentRemark = data.inc.genIncRemark()
        incidentStatus = data.inc.genIncStatus()
        incidentAssignment = await data.inc.genIncAssignment(deptId)
        
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
      })()

    })
    // TODO: refactor POST in rotues/incidents to be able to add
    // records to incident_assignments and incident_remarks without
    // having to create a new incident

  })

  describe('GET "/"', function(done) {

    it('should get all incidents by dept_id', function(done) {
      request(server)
      .get(`/api/incidents`)
      .send({dept_id: deptId})
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.be.an('array')
        expect(res.body[0]).to.have.property('inc_id')
        expect(res.body[0]).to.have.property('inc_status_id')
        done()
      })
    })

    it('should get a complete incident by inc_id', function(done) {
      request(server)
      .get(`/api/incidents`)
      .send({inc_id: incId})
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('remarks').that.is.a('array')
        expect(res.body).to.have.property('assignments').that.is.a('array')
        done()
      })
    })

  })

  describe('PATCH "/"', function(done) {

    it('should update an incident status', function(done) {
      let statusUpdate = {
        update: data.inc.genIncStatus(true),
        inc_status_id: incStatusId
      }
      if (DEBUG) console.log(`👉 ORIGINAL INC_STATUS: ${JSON.stringify(incidentStatus,null,2)}`);
      request(server)
      .patch(`/api/incidents`)
      .send({inc_status: statusUpdate})
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err);
        if (DEBUG) console.log(`👉 UPDATED INC_STATUS: ${JSON.stringify(res.body,null,2)}`);
        done()
      })
    })

  })

  describe('DELETE /:incId', function(done) {

    it('should delete an incident', function(done) {
      request(server)
      .delete(`/api/incidents/${incId}`)
      .expect(200)
      .end(function(err, res) {
        if (err) console.log(err)
        expect(res.body.data).equals('incident was successfully deleted')
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

})
