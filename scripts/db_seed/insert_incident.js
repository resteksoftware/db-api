const data = require('../../tests/data')
const axios = require('axios')
const departmentId = process.argv.slice(2)[0] 
const numIncidents = process.argv.slice(2)[1]

const seedIncident = async (deptId, numIncidents) => {
    
    let isValidDeptId = Object.prototype.toString.call(parseInt(deptId)) === "[object Number]"
    if (!isValidDeptId) {
        console.log("dept_id invalid");
        return
    }
    let numInc = numIncidents || 1
    console.log(`👉 Generating (${numInc}) incidents for Dept: ${deptId}`);
    // generate many incidents
    for (var i = 0; i < numInc; i++) {
        // create a remark
        let incidentRemark = data.inc.genIncRemark()
        // create an incident status
        let incidentStatus = data.inc.genIncStatus()
        // create an assignment
        let incidentAssignment = await data.inc.genIncAssignment(deptId)
        // create an incident (related to dept_id)
        let incident = data.inc.genIncident()

        let body = {
            dept_id: deptId,
            data: {
                inc: incident,
                incStatus: incidentStatus,
                incRemark: incidentRemark,
                incAssignment: incidentAssignment
            }
        }

        await axios({
            method: 'post',
            url: `http://localhost:8080/api/incidents/new`,
            data: body
        })

    }
    console.log(`👉 (${numInc}) incident(s) successfully posted`);
}

if (!departmentId) {
 console.log("please add dept_id by running this script again, 'node <script> [dept_id] [num_incidents]'");
} else {
    seedIncident(departmentId, numIncidents)
}
