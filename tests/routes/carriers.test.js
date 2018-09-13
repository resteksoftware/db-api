let server = require('../../app');
let request = require('supertest');
// let session = require('supertest-session');
// let testSession = session(server);
let should = require('chai').should()
let expect = require('chai').expect
let data = require('../data')

describe('API/CARRIERS', function() {
  let carrierNames = []
  let carrierIds = []

  describe('GET "/"', function(done){

    it('should should get all carriers', function(done) {
      request(server)
        .get('/api/carriers')
        .expect(200)
        .end((err, res) => {
          // write expect tests
          res.body.forEach(carrier => {
            carrierNames.push(carrier.carrier_name)
            carrierIds.push(carrier.carrier_id)
          })
          done();
        })
    });

    it('should get a carrier by carrier_id', function(done) {
      request(server)
        .get(`/api/carriers/${carrierIds[1]}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('carrier_id').to.be.a('number')
          expect(res.body).to.have.property('carrier_name').to.be.a('string')
          expect(res.body).to.have.property('gateway').to.be.a('string')
          expect(res.body).to.have.property('is_enabled').to.be.a('boolean')
          expect(res.body).to.have.property('created_at').to.be.a('string')
          expect(res.body).to.have.property('updated_at').to.be.a('string')
          done();
        })
    });

    it('should get a carrier by name', function(done) {
      request(server)
        .get(`/api/carriers/${carrierNames[1]}`)
        .expect(200)
        .end((err, res) => { 
          expect(res.body).to.have.property('carrier_id').to.be.a('number')
          expect(res.body).to.have.property('carrier_name').to.be.a('string')
          expect(res.body).to.have.property('gateway').to.be.a('string')
          expect(res.body).to.have.property('is_enabled').to.be.a('boolean')
          expect(res.body).to.have.property('created_at').to.be.a('string')
          expect(res.body).to.have.property('updated_at').to.be.a('string')
          done();
        })
    });

  });

})
