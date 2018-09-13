let server = require('../../app');
let request = require('supertest');
// let session = require('supertest-session');
// let testSession = session(server);
let should = require('chai').should()
let expect = require('chai').expect
let data = require('../data')
let DEBUG = require('../../logconfig.js').tests.routes.departments

describe('API/DEPTARTMENTS', function() {

  let deptId = ''
  let dept = data.dept.genDepartment()

    describe('POST "/"', function(done){

      it('should post a dept', function (done) {          
          if (DEBUG) console.log('👉 Rand Dept Generated \n', dept);
                  
           request(server)
              .post('/api/departments')
              .send(dept)
              .expect(200)
              .end(function(err, res) {
                if (err) console.log(err);
                // set deptId for future deletion
                deptId = res.body.dept_id
                expect(res.body).to.have.property('dept_id').that.is.a('number')
                done()
              })

      });

    });

    describe('GET "/:deptId"', function(done) {

      it('should get a dept using dept_id', function (done) {
         request(server)
            .get(`/api/departments/${deptId}`)
            .expect(200)
            .end(function(err, res) {
              if (err) console.log(err);
              expect(res.body).to.have.property('dept_id').that.is.a('number')
              expect(res.body).to.have.property('dept_name').that.is.a('string')
              expect(res.body).to.have.property('dept_abbr').that.is.a('string')
              expect(res.body).to.have.property('dept_head').that.is.a('string')
              expect(res.body).to.have.property('dept_city').that.is.a('string')
              expect(res.body).to.have.property('dept_state').that.is.a('string')
              expect(res.body).to.have.property('dept_zip').that.is.a('string')
              expect(res.body).to.have.property('dept_county').that.is.a('string')
              expect(res.body).to.have.property('dept_ip').that.is.a('string')
              expect(res.body).to.have.property('created_at').that.is.a('string')
              expect(res.body).to.have.property('updated_at').that.is.a('string')
              done()
            })
      })
    })

    describe('PATCH "/:deptId"', function(done) {
      let departmentUpdate = {dept_name: 'UpdatedDepartment'}
      it('should update a dept using dept_id', function (done) {
        request(server)
          .patch(`/api/departments/${deptId}`)
          .send(departmentUpdate)
          .expect(200)
          .end(function (err, res) {
            if (err) console.log(err);
            expect(res.body.dept_name).to.equal('UpdatedDepartment')
            expect(res.body).to.have.property('dept_id').that.is.a('number')
            expect(res.body).to.have.property('dept_name').that.is.a('string')
            expect(res.body).to.have.property('dept_abbr').that.is.a('string')
            expect(res.body).to.have.property('dept_head').that.is.a('string')
            expect(res.body).to.have.property('dept_city').that.is.a('string')
            expect(res.body).to.have.property('dept_state').that.is.a('string')
            expect(res.body).to.have.property('dept_zip').that.is.a('string')
            expect(res.body).to.have.property('dept_county').that.is.a('string')
            expect(res.body).to.have.property('dept_ip').that.is.a('string')
            expect(res.body).to.have.property('created_at').that.is.a('string')
            expect(res.body).to.have.property('updated_at').that.is.a('string')
            done()
          })
      })
    })

    describe('DELETE "/:deptId"', function(done) {
      let departmentUpdate = {dept_name: 'UpdatedDepartment'}
      it('should delete a dept using dept_id', function (done) {
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
      
      it('should not find deleted department from deletion', function (done) {
        request(server)
          .get(`/api/departments/${deptId}`)
          .expect(200)
          .end(function (err, res) {
            if (err) console.log(err);
            expect(res.body).to.deep.equal({})
            done()
          })
      })
    })


  });
