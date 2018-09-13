//https://github.com/marak/Faker.js/
var faker = require('faker');

let response_user = {
    // resp_user_id           : '',
    user_id                : '',
    inc_id                 : '',
    respond_direct         : '',
    init_resp_timestamp    : '',
    init_resp_gps          : '',
    onscene_resp_timestamp : '',
    onscene_resp_gps       : '',
    closing_resp_timestamp : '',
    closing_resp_gps       : ''
}

let response_apparatus = {
    // resp_app_id            : '',
    app_id                 : '',
    inc_id                 : '',
    init_resp_timestamp    : '',
    init_resp_gps          : '',
    onscene_resp_timestamp : '',
    onscene_resp_gps       : '',
    closing_resp_timestamp : '',
    closing_resp_gps       : ''
}

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const genRespUser = (userId, incId) => {
    let response = Object.assign({}, response_user)
    response.user_id                = userId
    response.inc_id                 = incId
    response.respond_direct         = faker.random.boolean()
    response.init_resp_timestamp    = faker.date.recent(1)
    response.init_resp_gps          = `{ lat: ${faker.address.latitude()}, lng: ${faker.address.longitude()} }` 
    response.onscene_resp_timestamp = null
    response.onscene_resp_gps       = null
    response.closing_resp_timestamp = null
    response.closing_resp_gps       = null
    return response
}

const genRespApp = (appId, incId) => {
    let response = Object.assign({}, response_apparatus)
    response.app_id                 = appId
    response.inc_id                 = incId
    response.init_resp_timestamp    = faker.date.recent(1)
    response.init_resp_gps          = `{ lat: ${faker.address.latitude()}, lng: ${faker.address.longitude()} }`
    response.onscene_resp_timestamp = null
    response.onscene_resp_gps       = null
    response.closing_resp_timestamp = null
    response.closing_resp_gps       = null
    return response
}

const genRespUpdate = () => {
    return {
        onscene_resp_timestamp : faker.date.recent(1),
        onscene_resp_gps       : `{ lat: ${faker.address.latitude()}, lng: ${faker.address.longitude()} }`
    }
}


module.exports = { 
    genRespUser : genRespUser, 
    genRespApp  : genRespApp,
    genRespUpdate
}


// CREATE TABLE "responses_apparatus"(
//     "resp_app_id" integer NOT NULL UNIQUE,
//     "app_id" integer NOT NULL,
//     "inc_id" integer NOT NULL,
//     "init_resp_timestamp" TIMESTAMP NOT NULL,
//     "init_resp_gps" varchar NOT NULL,
//     "onscene_resp_timestamp" TIMESTAMP,
//     "onscene_resp_gps" varchar,
//     "closing_resp_timestamp" TIMESTAMP,
//     "closing_resp_gps" varchar,
//     CONSTRAINT responses_apparatus_pk PRIMARY KEY("resp_app_id")
// ) WITH(
//     OIDS = FALSE
// );

// CREATE TABLE "responses_users"(
//     "resp_user_id" serial NOT NULL,
//     "user_id" integer NOT NULL,
//     "inc_id" integer NOT NULL,
//     "respond_direct" BOOLEAN NOT NULL,
//     "init_resp_timestamp" TIMESTAMP NOT NULL,
//     "init_resp_gps" varchar NOT NULL,
//     "onscene_resp_timestamp" TIMESTAMP,
//     "onscene_resp_gps" varchar,
//     "closing_resp_timestamp" TIMESTAMP,
//     "closing_resp_gps" varchar,
//     CONSTRAINT responses_users_pk PRIMARY KEY("resp_user_id")
// ) WITH(
//     OIDS = FALSE
// );