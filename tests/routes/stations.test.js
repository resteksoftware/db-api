let server = require('../../app');
let request = require('supertest');
// let session = require('supertest-session');
// let testSession = session(server);
let should = require('chai').should()
let expect = require('chai').expect
let data = require('../data')

describe('API/STATIONS', function() {

  let deptId = ''
  let staIds = new Set()
  // create one new department and store dept_id as deptId
  before(function(done) {
    (async () => {
      let dept = await data.dept.genDepartment()
      request(server)
      .post('/api/departments')
      .send(dept)
      .end(function(err, res) {
        deptId = res.body.dept_id
        done()
      })
    })()
  })

    describe('POST "/"', function(done) {

      it('should post a station', function (done) {

          let sta = data.sta.genStations(1)[0]
          sta.dept_id = deptId
          
           request(server)
              .post(`/api/stations`)
              .send(sta)
              .expect(200)
              .end(function(err, res) {
                if (err) console.log(err);
                staIds.add(res.body.sta_id)
                expect(res.body).to.have.property('sta_id').that.is.a('number')
                done()
              })
      });

      it('should post multiple stations', function (done) {

        (async () => {

          let stas = await data.sta.genStations(10)
          let stasToAdd = stas.map( el => {
            el.dept_id = deptId
            return el
          })

          await new Promise(resolve => {
           request(server)
              .post(`/api/stations`)
              .send(stas)
              .expect(200)
              .end(function(err, res) {
                if (err) console.log(err);
                expect(res.body).to.have.property('data').that.is.a('string')
                expect(res.body).to.deep.equal({data: 'success'})
                done()
              })
          })

        })()

      });

      // should not allow stations to be added with non-existent deptId

    });

    describe('GET "/:deptId"', function(done){

      it('should get all stations using dept_id', function (done) {
         request(server)
            .get(`/api/stations/${deptId}`)
            .expect(200)
            .end(function(err, res) {
              if (err) console.log(err);
              expect(res.body).to.be.an('array')
              res.body.forEach(sta => {
                expect(sta).to.have.property('sta_id').that.is.a('number')
                expect(sta).to.have.property('sta_name').that.is.a('string')
                expect(sta).to.have.property('sta_abbr').that.is.a('string')
                expect(sta).to.have.property('sta_type').that.is.a('string')
                expect(sta).to.have.property('sta_gps').that.is.a('string')
                expect(sta).to.have.property('dept_id').that.is.a('number')
                expect(sta).to.have.property('is_enabled').that.is.a('boolean')
                expect(sta).to.have.property('created_at').that.is.a('string')
                expect(sta).to.have.property('updated_at').that.is.a('string')
                // collect all stations from fake department for deletion
                staIds.add(sta.sta_id)
              })

              done()
            })
      })

      it('should get a station using dept_id and sta_id', function (done) {
        // get first value out of staIds Set for test
        let staIterator = staIds.values()
        let staId = staIterator.next().value

         request(server)
            .get(`/api/stations/${deptId}/${staId}`)
            .expect(200)
            .end(function(err, res) {
              if (err) console.log(err);
              expect(res.body).to.have.property('sta_id').that.is.a('number')
              expect(res.body).to.have.property('sta_name').that.is.a('string')
              expect(res.body).to.have.property('sta_abbr').that.is.a('string')
              expect(res.body).to.have.property('sta_type').that.is.a('string')
              expect(res.body).to.have.property('sta_gps').that.is.a('string')
              expect(res.body).to.have.property('dept_id').that.is.a('number')
              expect(res.body).to.have.property('is_enabled').that.is.a('boolean')
              expect(res.body).to.have.property('created_at').that.is.a('string')
              expect(res.body).to.have.property('updated_at').that.is.a('string')
              done()
            })
      })
    });

  describe('PATCH "/:staId"', function (done) {

    it('should update a station', function (done) {
      let staId = [...staIds][0]
      let staUpdate = {sta_name: 'UpdatedStation'}

      request(server)
        .patch(`/api/stations/${staId}`)
        .send(staUpdate)
        .expect(200)
        .end(function (err, res) {
          if (err) console.log(err);
          expect(res.body.sta_name).to.equal('UpdatedStation')
          done()
        })
    });

  });

    // should not allow stations to be added with non-existent deptId
  describe('DELETE "/:staId"', function (done) {

    it('should delete a station and associated apparatus', function (done) {
      let staId = [...staIds][0]
      request(server)
      .delete(`/api/stations/${staId}`)
      .expect(200)
      .end(function (err, res) {
        if (err) console.log(err);
        expect(res.body.data).to.equal('station and all associated apparatus have been deleted')
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
    });

  });


  });
