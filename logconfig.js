// this file sets DEBUG to true for the given file path associated with
// the object property changed

//example: routes.users = false will set DEBUG to false for /routes/users.js

module.exports = {
  app: false,
  models: {
    index: true
  },
  routes : {
    apparatus: false,
    carriers: false,
    departments: false,
    incidents: false,
    responses: false,
    stations: false,
    track_user_apparatus: false,
    track_user_stations: false,
    users: true,
    util: {
      sendEmailMailgun: false,
      sendEmailPooledRustybear: false,
      sendEmailRustybear: false,
      sendTwilio: false
    }
  },
  tests : {
    routes: {
      apparatus: false,
      departments: false,
      stations: false,
      responses: false,
      users: false,
      incidents: false
    }
  }
}
