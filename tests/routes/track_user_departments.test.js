// let server = require('../../app');
// let request = require('supertest');
// // let session = require('supertest-session');
// // let testSession = session(server);
// let should = require('chai').should()
// let expect = require('chai').expect
// let data = require('../data')
//
// const getRandomIntInclusive = (min, max) => {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
// }
//
// describe('API/TRACK_USER_DEPARTMENTS', function() {
//
//   let users = [];
//   let userIds = new Set();
//   let department;
//   let departmentId;
//   let trackUserDepartmentIds = new Set();
//
//
//   before(function(done) {
//
//     (async () => {
//       let carriers;
//       // generate department
//       department = await data.dept.genDepartment()
//       // fetch carriers
//       await new Promise(resolve => {
//         request(server)
//         .get(`/api/carriers`)
//         .expect(200)
//         .end(function(err, res) {
//           if (err) console.log(err);
//           // store results to carriers
//           carriers = res.body
//           // post department
//           request(server)
//           .post(`/api/departments`)
//           .send(department)
//           .expect(200)
//           .end(function(err, res) {
//             departmentId = res.dept_id
//             // generate users
//             for (var i = 0; i < getRandomIntInclusive(5, 20); i++) {
//               // get random carrier by id
//               let randCarrierId = carriers[getRandomIntInclusive(0, carriers.length - 1)].carrier_id
//               // generate user
//               let user = data.user.genUser(randCarrierId, departmentId)
//               // add user to users collection
//               users.push(user)
//             }
//             // add users
//             request(server)
//             .post(`/api/users`)
//             .send(users)
//             .expect(200)
//             .end(function(err, res) {
//               // get user_ids
//               request(server)
//               .get(`/api/users/`)
//             })
//           })
//
//         })
//       })
//
//     })()
//
//   })
//
//
//   describe('POST "/:deptId/:userId"', function(done) {
//
//     it('should post one user to one department', function (done) {
//
//       // (async () => {
//       //   let carrierId = carriers[getRandomIntInclusive(0, carriers.length - 1)].carrier_id
//       //   let defaultStation = '1'
//       //   let user = await data.user.genUser(carrierId, defaultStation)
//       //
//       //   await new Promise(resolve => {
//       //    request(server)
//       //       .post(`/api/users`)
//       //       .send(user)
//       //       .expect(200)
//       //       .end(function(err, res) {
//       //         if (err) console.log(err);
//       //         expect(res.body).to.have.property('user_id').that.is.a('number')
//       //         done()
//       //       })
//       //   })
//       // })()
//
//     });
//
//     it('should post multiple users to one department', function (done) {
//
//       //   (async () => {
//       //     let numUsers = getRandomIntInclusive(3, 20)
//       //     let users = []
//       //
//       //     for (var i = 0; i < numUsers; i++) {
//       //       let carrierId = carriers[getRandomIntInclusive(0, carriers.length - 1)].carrier_id
//       //       let defaultStation = '1'
//       //       let user = await data.user.genUser(carrierId, defaultStation)
//       //       users.push(user)
//       //     }
//       //
//       //     await new Promise(resolve => {
//       //      request(server)
//       //         .post(`/api/users`)
//       //         .send(users)
//       //         .expect(200)
//       //         .end(function(err, res) {
//       //           if (err) console.log(err);
//       //           expect(res.body).to.have.property('data').that.is.a('string')
//       //           expect(res.body).to.deep.equal({data: 'success'})
//       //           done()
//       //         })
//       //     })
//       //   })()
//       //
//       done()
//     });
//
//   });
//
//
//
// });
