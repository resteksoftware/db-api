const ctrl = require('../../controllers')

const { logDate } = require('../util/logDate')

const DEBUG = require('../logconfig').routes.util.getSubscribedUsers // Set this to 'true' to activate console logging of several important variables

// NOTE: this is not complete, but more or less this is the correct workflow for getting users subscribed
let usersSubscribed;

if (inc.inc_type_code === '850') {
    // get all users from department
    usersSubscribed = await ctrl.user.getAllUsersByDeptId(deptId)
} else {
    // get all apparatuses in department as sta_abbr + sta_id keys
    let deptApps = await ctrl.app.getAllAppsByDeptId(deptId)
    // filter apparatuses down to apparatuses on incident assignment
    let incAppAssignment = incAssignment.assignment.split(',').filter(app => app !== '')
    // filter department apparatuses down to apparatuses on incident assignment
    let appAssignmentIds = deptApps.filter(app => incAppAssignment.includes(app.app_abbr)).map(app => app.app_id)
    // get all user_tracking_apparatus based on apparatus keys filtered
    let usersTrackingAppAssignment = await ctrl.user.getAllUsersByApparatusIds(appAssignmentIds)
    // map users down to ids
    let userIdsSubscribed = usersTrackingAppAssignment.map(user => user.user_id)
    // get all users from userIdsSubscribed
    usersSubscribed = await ctrl.user.getAllUsersByIds(userIdsSubscribed)
}
