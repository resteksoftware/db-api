/**
 * routes/departments.js
 */

const express = require('express')
const departments = express.Router()
const ctrl = require('../controllers')
const DEBUG = require('../logconfig').routes.departments


/**
 * Returns department collection from given department
 */
departments.get('/:deptId', async (req, res, next) => {
    let deptId = req.params.deptId
    let dept = await ctrl.dept.getDeptById(deptId)
    res.send(dept)
})

/**
 * Adds department and returns departmentId
 */
departments.post('/', async (req, res, next) => {
    let dept = JSON.parse(req.body)
    if (DEBUG) console.log(`👉 POST /api/departments/ \ndept:${JSON.stringify(dept, null, 2)}`);
    let deptId = await ctrl.dept.saveDept(dept)
    
    res.send({dept_id: deptId})
})

/**
 * Updates a department and returns updated department
 */
departments.patch('/:deptId', async (req, res, next) => {
    let deptId = req.params.deptId
    let body = JSON.parse(req.body)
    let updatedDept = await ctrl.dept.updateDept(deptId, body)
    res.send(updatedDept[1][0])
})

/**
 * Deletes department and all associated stations/apparatus
 */
departments.delete('/:deptId', async (req, res, next) => {
    let deptId = req.params.deptId
    let result = await ctrl.dept.deleteDeptById(deptId)
    
    res.send({data: result})
})

module.exports = departments
