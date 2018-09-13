//https://github.com/marak/Faker.js/
var faker = require('faker');

let apparatus = [
    {
        'app_abbr'   : 'E',
        'app_name'   : 'Engine',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'TK',
        'app_name'   : 'Tanker',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'U',
        'app_name'   : 'Utility',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'FM',
        'app_name'   : 'Fire Marshall',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'P',
        'app_name'   : 'Patrol',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'L',
        'app_name'   : 'Ladder',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'SO',
        'app_name'   : 'Special Operations',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'SQ',
        'app_name'   : 'Squad',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'R',
        'app_name'   : 'Rescue',
        'is_enabled' : true,
        //needs sta_id
    },
    {
        'app_abbr'   : 'DECON',
        'app_name'   : 'Decon',
        'is_enabled' : true,
        //needs sta_id
    }
]

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const genApparatusCollection = (stationId, numApps) => {
    let count = 1;
    let output = []
    let uniqueKeys = new Set()

    for (var i = 0; i < numApps; i++) {
        // clone random apparatus from list at random
        let app = Object.assign(
            {},
            apparatus[getRandomIntInclusive(0, apparatus.length - 1)]
        )
        // set station id
        app.sta_id = stationId
        // append station num to app_abbr
        app.app_abbr = app.app_abbr + stationId
        // if item already exists in set
        if (uniqueKeys.has(app.app_abbr)) {
            // append additional number
            app.app_abbr = app.app_abbr + count
            // increase count to prevent duplicates
            count ++
        }
        // add item to set
        uniqueKeys.add(app.app_abbr)
        // add apparatus to collection
        output.push(app)
    }
    // return collection
    return output

}


module.exports = {genApparatusCollection: genApparatusCollection}

// CREATE TABLE "apparatus" (
// 	"app_id" serial NOT NULL,
// 	"sta_id" integer NOT NULL,
// 	"app_abbr" varchar NOT NULL,
// 	"app_name" varchar NOT NULL,
// 	"is_enabled" BOOLEAN NOT NULL,
// 	"created_at" TIMESTAMP NOT NULL,
// 	"updated_at" TIMESTAMP NOT NULL,
// 	CONSTRAINT apparatus_pk PRIMARY KEY ("app_id")
// ) WITH (
//   OIDS=FALSE
// );
