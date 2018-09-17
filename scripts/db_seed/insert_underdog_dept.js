const axios = require('axios')
const DEBUG = true;

let department = {
    'dept_name': 'Underdog Technologies Fire Department',
    'dept_abbr': 'UDOG',
    'dept_head': 'Pete Siecienski',
    'dept_ip': '69.195.33.74',
    'dept_city': 'Fairfield',
    'dept_state': 'CT',
    'dept_zip': '06824',
    'dept_county': 'Fairfield County'
}

let users = [
    {
        "first_name": 'Kevin',
        "last_name": 'Coyner',
        "mobile_num": '2035160005',
        // needs carrier_id
        "email": 'kevin@restek.io',
        "device_os": 'android',
        "rank": 'firefighter',
        // needs default_station id
        "is_driver": false,
        "is_enabled": true,
        "is_sleeping": false,
        "is_admin": true,
        "is_deleted": false,
        "is_career": true,
        "is_volley": false
    },
    {
        "first_name": 'Nick',
        "last_name": 'Freeman',
        "mobile_num": '8057060651',
        // needs carrier_id
        "email": 'nick@restek.io',
        "device_os": 'android',
        "rank": 'deck_hand',
        // needs default_station id
        "is_driver": false,
        "is_enabled": true,
        "is_sleeping": false,
        "is_admin": true,
        "is_deleted": false,
        "is_career": false,
        "is_volley": true
    }
]

let stations = [
    {
        'sta_name': 'Station 1',
        'sta_abbr': 'STA1',
        'is_enabled': true,
        'sta_type': 'combination',
        // needs dept_id
        'sta_gps': '{lat: "", lng: ""}'
    },
    {
        'sta_name': 'Station 2',
        'sta_abbr': 'STA2',
        'is_enabled': true,
        'sta_type': 'combination',
        // needs dept_id
        'sta_gps': '{lat: "", lng: ""}'
    },
    {
        'sta_name': 'Station 3',
        'sta_abbr': 'STA3',
        'is_enabled': true,
        'sta_type': 'combination',
        // needs dept_id
        'sta_gps': '{lat: "", lng: ""}'
    },
    {
        'sta_name': 'Station 4',
        'sta_abbr': 'STA4',
        'is_enabled': true,
        'sta_type': 'combination',
        // needs dept_id
        'sta_gps': '{lat: "", lng: ""}'
    },
    {
        'sta_name': 'Station 5',
        'sta_abbr': 'STA5',
        'is_enabled': true,
        'sta_type': 'combination',
        // needs dept_id
        'sta_gps': '{lat: "", lng: ""}'
    },
    {
        'sta_name': 'Station 6',
        'sta_abbr': 'STA6',
        'is_enabled': true,
        'sta_type': 'volunteer',
        // needs dept_id
        'sta_gps': '{lat: "", lng: ""}'
    },
    {
        'sta_name': 'Station 7',
        'sta_abbr': 'STA7',
        'is_enabled': true,
        'sta_type': 'volunteer',
        // needs dept_id
        'sta_gps': '{lat: "", lng: ""}'
    },
    {
        'sta_name': 'Station 8',
        'sta_abbr': 'STA8',
        'is_enabled': true,
        'sta_type': 'career',
        // needs dept_id
        'sta_gps': '{lat: "", lng: ""}'
    }
]

let stationApparatusMapping = {
    STA1: ['DC', 'E1', 'T1', 'DECON', 'SO1', 'SQ1'],
    STA2: ['E2', 'TK2', 'U2', 'P2'],
    STA3: ['E3', 'E31', 'U3'],
    STA4: ['E41', 'L4', 'E4', 'SQ4', 'U4V'],
    STA5: ['E5', 'L5', 'E51', 'R5', 'R51'],
    STA6: ['E62', 'TK6', 'E61'],
    STA7: ['E71', 'TK7'],
    STA8: ['E8']
}

let apparatus = [

    {
        app_abbr : 'DC',
        app_name : 'Deputy Chief',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E3',
        app_name : 'Engine 3',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E1',
        app_name : 'Engine 1',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E2',
        app_name : 'Engine 2',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E5',
        app_name : 'Engine 5',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E8',
        app_name : 'Engine 8',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E31',
        app_name : 'Engine 31',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr :'T1',
        app_name : 'Tower 1',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E41',
        app_name : 'Engine 41',
        enabled : true,
        // needs sta_id
    },
    {
        app_abbr : 'E62',
        app_name : 'Engine 62',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E71',
        app_name : 'Engine 71',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr:'TK2',
        app_name : 'Tanker 2',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr: 'TK7',
        app_name: 'Tanker 7',
        is_enabled: true
        // needs sta_id
    },
    {
        app_abbr: 'TK6',
        app_name: 'Tanker 6',
        is_enabled: true
        // needs sta_id
    },
    {
        app_abbr : 'U2',
        app_name : 'Utility 2',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'L5',
        app_name : 'Ladder 5',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'L4',
        app_name : 'Ladder 4',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E51',
        app_name : 'Engine 51',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'P2',
        app_name : 'Patrol 2',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E61',
        app_name : 'Engine 61',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'DECON',
        app_name : 'Decon',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'R5',
        app_name : 'Rescue 5',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'R51',
        app_name : 'Rescue 51',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'SO1',
        app_name : 'Special Operations 1',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'E4',
        app_name : 'Engine 4',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'SQ1',
        app_name : 'Squad 1',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'SQ4',
        app_name : 'Squad 4',
        is_enabled : true
        // needs sta_id
    },
    {
        app_abbr : 'U4V',
        app_name : 'Utility 4',
        is_enabled : true
        // needs sta_id
    }
]


const seedUnderdog = async () => {
    // get carriers and add carrier_id to users
    let carriers = await axios.get('http://localhost:8080/api/carriers').then(resp => resp.data)
    // add carrier_id to users
    carriers.forEach( carrier => {
        if (carrier.carrier_name === 'Google Fi') {
            users[0].carrier_id = carrier.carrier_id
        } else if (carrier.carrier_name === 'Verizon') {
            users[1].carrier_id = carrier.carrier_id
        }
    })
    // create a dept
    let dept = Object.assign({}, department)
    console.log(`👉 Dept generated: \n${JSON.stringify(dept, null, 2)}`);
    // post department
    let deptId = await axios.post('http://localhost:8080/api/departments', dept).then(res => res.data.dept_id)
    console.log(`👉 deptId returned: ${JSON.stringify(deptId, null, 2)}`);

    // iterate across stations collection
    for (var i = 0; i < stations.length; i++) {

        let sta = stations[i]
        // add department id to station
        sta.dept_id = deptId
        // collect app_ids created
        let output = []
        // post station
        let staId = await axios.post('http://localhost:8080/api/stations', sta).then(resp => resp.data.sta_id)
        // iterate across station's associated apparatuses
        for (var j = 0; j < stationApparatusMapping[sta.sta_abbr].length; j++) {
            // get app by app_abbr
            let appAbbr = stationApparatusMapping[sta.sta_abbr][j]
            let appToInsert;
            // iterate across available apparatus
            apparatus.forEach(app => {

                // set app if apparatus shares same app_abbr in station apparatus mapping
                if (app.app_abbr === appAbbr) {
                    appToInsert = app
                }
            })
            // add station id to apparatus
            appToInsert.sta_id = staId

            // add default stations to users
            if (sta.sta_abbr === 'STA4') {
                users[0].default_station = staId
                users[1].default_station = staId
            }
            // post app
            let appId = await axios.post('http://localhost:8080/api/apparatus', appToInsert).then(resp => resp.data.app_id)
            output.push(appId)
        }
        console.log(`👉 sta_id: ${staId} has associated app_ids: ${output + ''}`)
    }

    await axios({
        method: 'post',
        url: 'http://localhost:8080/api/users',
        data: {
            user: users,
            dept_id: deptId
        }
    })

    let userIds = await axios({
        method: 'get',
        url: 'http://localhost:8080/api/users/',
        data: { dept_id: deptId }
    }).then(res => res.data.map(user => user.user_id))
    if (DEBUG) console.log(`👉 userIds returned: \n${userIds}`);
    if (DEBUG) console.log(`👉 done`);

}

seedUnderdog()
