/**
 * controllers/departments.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete

// getDepartmentById: returns one department by dept_id
const getDeptById = (deptId) => {
  return db.departments.findOne({
      where: {
        dept_id: deptId
      },
      raw: true
    })
    .then( dept => dept )
    .catch( err => err )
}

// getAllDepartments: returns all departments
const getAllDepts = () => {
  return new Promise( (resolve, reject) => {
    db.departments.findAll()
    .then( depts => resolve(depts) )
    .catch( err => reject(err) )
  })
}

// getAllDeptDetailsById: returns object containing all associated station and apparatus ids
const getAllDeptDetailsById = async (deptId) => {
  let output = {
    dept_id: deptId,
    sta_id: [],
    app_id: []
  }
  // find all stations by dept id
  let stations = await db.stations.findAll({
    where: {
      dept_id: deptId
    },
    raw: true
  })
  .then( stations => output.sta_id = stations.map(sta => sta.sta_id))
  
  // find all apparatus by stations id collection
  await db.apparatus.findAll({
    where: {
      sta_id: {
        [Op.in]: stations
      }
    },
    raw: true
  })
  .then( apparatus => output.app_id = apparatus.map(app => app.app_id))
  
  // return obj with all ids
  return output
}

const getDeptByUserId = async (userId) => {
  return db.track_user_departments.findAll({
    where: {
      user_id: userId
    },
    raw: true
  })
  .then(resp => resp.map( trk => trk.dept_id) )
  .then(deptIds => {
    const hasOneDept = deptIds.every(el => el === deptIds[0])

    if (hasOneDept) {
      return deptIds[0]
    } else {
      console.log('🤢 WOOPS: User belongs to two departments! U sure?');
      return false
    }
  })
  .then( deptId => {
    if (!deptId) {
      return 'error'
    }
    return db.departments.find({
      where: {
        dept_id: deptId
      },
      raw: true
    })
  })
  .then( dept => dept ) 
}

// saveDepartment: saves department and returns new dept_id
const saveDept = (department) => {
  return db.departments.create(department)
    .then( dept => dept.id )
    .catch( err => err )
}

// saveAllDepartments: saves all departments and returns success/fail
const saveAllDepts = (departmentsColl) => {
  return db.departments.bulkCreate(departmentsColl)
    .then( response => resolve('success') )
    .catch( err => reject(err) )
}

// updateDept
const updateDept = (deptId, deptUpdate) => {
  return db.departments.update(deptUpdate, 
    {
      returning: true,
      raw: true,
      where: {
        dept_id: deptId
      }
    })
    .then( updatedDept => updatedDept )
    .catch( err => err )
}

// deleteDept and all associated stations/apparatus
const deleteDeptById = async (deptId) => {
  let ids = await getAllDeptDetailsById(deptId)

  return db.apparatus.destroy({
    where: {
      app_id: {
        [Op.in]: ids.app_id
      }
    },
    raw: true
  })
  .then( resp => {
    return db.stations.destroy({
      where: {
        sta_id: {
          [Op.in]: ids.sta_id
        }
      },
      raw: true
    })
  })
  .then( resp => {
    return db.departments.destroy({
      where: {dept_id: ids.dept_id},
      raw: true
    })
  })
  .then( resp => 'department and all associated stations/apparatus have been deleted' )
  .catch( err => err)
}

module.exports = {
  getDeptById           : getDeptById,
  getAllDeptDetailsById : getAllDeptDetailsById,
  getAllDepts           : getAllDepts,
  getDeptByUserId       : getDeptByUserId,
  saveDept              : saveDept,
  saveAllDepts          : saveAllDepts,
  deleteDeptById        : deleteDeptById,
  updateDept            : updateDept
}
