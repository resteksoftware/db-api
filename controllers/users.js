/**
 * controllers/users.js
 *
 */

const db = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


// get, save, update, delete


// getAllUsersByDeptId: returns all users by deptId
const getAllUsersByDeptId = (deptId) => {
    // get all users in department
   return db.track_user_departments.findAll({
      attributes: ['user_id'],
      where: {
        dept_id: deptId
      },
      raw: true
    })
    .then( userIds => {
      let idsArr = userIds.map(usr => usr.user_id)
      // get all users matching userIds
      return db.users.findAll({
        where: {
          user_id: {
            [Op.in]: idsArr
          }
        },
        raw: true
      })
    })
    .then( users => users )
    .catch( err => err )
}

const getAllUserAdminsByDeptId = (deptId) => {
  return db.users.findAll({
    where: {
      is_admin: true
    },
    raw: true
  })
  .then(users => users )
  .catch(err => err )
}

const getAllUsersByIds = (userIdsArr) => {
  let users;

  if (Array.isArray(userIdsArr)) {
    users = userIdsArr
  } else {
    users = [userIdsArr]
  }
  
  return db.users.findAll({
    where: {
      user_id: {
        [Op.in]: users
      }
    },
    raw: true
  })
  .then(users => users)
  .catch(err => err)
  }

const getAllUsersByApparatusIds = (appIdsArr) => {
  let apps;

  if (Array.isArray(appIdsArr)) {
    apps = appIdsArr
  } else {
    apps = [appIdsArr]
  }

  return db.track_user_apparatus.findAll({
    where: {
      app_id: {
        [Op.in]: apps
      }
    },
    raw: true
  })
  .then( users => users )
  .catch( err => err )
  
}

const getAllUsersByStationIds = (staIdsArr) => {
  let stas;

  if (Array.isArray(staIdsArr)) {
    stas = staIdsArr
  } else {
    stas = [staIdsArr]
  }

  return db.track_user_stations.findAll({
    where: {
      sta_id: {
        [Op.in]: stas
      }
    },
    raw: true
  })
  .then( users => users )
  .catch( err => err )
}

// saveUser: saves user and returns new user_id
const saveUser = (user, carrierId, defaultStationId) => {
  if (carrierId) user.carrier_id = carrierId
  if (defaultStationId) user.default_station = defaultStationId

  return  db.users.create(user)
  .then( user => user.id)
  .catch( err => console.error(err) )
}

// saveAllUsers: saves all users and returns success/fail
const saveAllUsers = (usersColl) => {
  
return db.users.bulkCreate(usersColl)
.then( response => 'success')
.catch( err => err)
  
}

// saveUserToDepartment: associates a user to a department
const saveUserToDepartment = (deptId, userId) => {
  let record = {
    dept_id: deptId,
    user_id: userId
  }
  
return db.track_user_departments.create(record)
.then( response => response.id)
.catch( err => err)
  
}

// saveUserToStation: associates a user to a station, as well as the station's apparatus
const saveUserToStation = (staId, userId, staApps) => {
  let record = {
    sta_id: staId,
    user_id: userId
  }

  let appsToAdd = staApps.map(app => {
    return {
      app_id: app.app_id,
      user_id: userId
    }
  })
  
return db.track_user_apparatus.bulkCreate(appsToAdd)
.then(resp => db.track_user_stations.create(record) )
.then(response => response.id)


.catch( err => err )
  
}

// saveUserToApparatus: associates a user to a department
const saveUserToApparatus = (appId, userId) => {
  let record = {
    app_id: appId,
    user_id: userId
  }
  return db.track_user_apparatus.create(record)
  .then( response => response.id)
  .catch( err => err)

}
// deleteUserFromDepartment: removes user from Department
const deleteUserFromDepartment = (deptId, userId) => {
  return db.track_user_departments.destroy({
      where: {
        dept_id: deptId,
        user_id: userId
      }
    })
    .then(response => 'association deleted between department and user' )
    .catch(err => err )
}


// deleteUserFromStation: removes user from Station. also removes user from Station's apparatus
const deleteUserFromStation = (staId, userId, staApps) => {
  let appsToRemove = []
  staApps.forEach(app => appsToRemove.push(app.app_id))

  return db.track_user_apparatus.destroy({
    where: {
      [Op.and] : [
        {
          user_id: userId
        },
        {
          app_id: {
            [Op.in] : appsToRemove
          }
        }
      ]
    }
  })
  .then (resp => resp )
  .then ( resp => {
    return db.track_user_stations.destroy({
      where: {
        sta_id: staId,
        user_id: userId
      }
    })
  })
  .then( response => 'association deleted between station and user' )
  .catch(err => err )
  

}

// deleteUserFromApparatus: removes user from Apparatus
const deleteUserFromApparatus = (appId, userId) => {
  return db.track_user_apparatus.destroy({
    where: {
      app_id: appId,
      user_id: userId
    }
  })
  .then(response => 'association deleted between apparatus and user' )
  .catch(err => err )
}

// updateUserById: updates a user based on user_id
const updateUserById = (userId, userUpdate) => {

  return db.users.update(userUpdate,
    {
      returning: true,
      raw: true,
      where: {
        user_id: userId
      }
    })
  .then(updatedUser => updatedUser )
  .catch(err => err )
}

// updateAllUsers

// deleteUser: doesnt actually delete user?
const updateUserAsDeleted = (userId) => {
  return db.users.findOne({
    where: { user_id: userId },
    raw: true
  })
  .then(foundUser => {
    return db.users.update({
      "first_name"      : foundUser.first_name,
      "last_name"       : foundUser.last_name,
      "mobile_num"      : foundUser.mobile_num,
      "carrier_id"      : foundUser.carrier_id,
      "email"           : foundUser.email,
      "device_os"       : foundUser.device_os,
      "rank"            : foundUser.rank,
      "default_station" : foundUser.default_station,
      "is_driver"       : foundUser.is_driver,
      "is_enabled"      : foundUser.is_enabled,
      "is_sleeping"     : foundUser.is_sleeping,
      "is_admin"        : foundUser.is_admin,
      "is_deleted"      : true,
      "is_career"       : foundUser.is_career,
      "is_volley"       : foundUser.is_volley,
    })
    .catch(err => reject(err) )
  })
  .then(updatedUser => updatedUser )
  .catch(err => err )
}

// deleteAllUsers
const deleteUserById = (userId) => {
  if (!Array.isArray(userId)) {
    userId = [userId]
  }

  return db.track_user_apparatus.destroy({
      where: { 
        user_id: {
          [Op.in]: userId
        } 
      },
      raw: true
    })
    .then( resp => {
      return db.track_user_stations.destroy({
        where: { 
          user_id: {
            [Op.in]: userId
          } 
        },
        raw: true
      })
      .catch(err => err)
    })
    .then( resp => {
      return db.track_user_departments.destroy({
        where: { 
          user_id: {
            [Op.in]: userId
          } 
        },
        raw: true
      })
      .catch(err => err)
    })
    .then( resp => {
      return db.users.destroy({
        where: { 
          user_id: {
            [Op.in]: userId
          } 
        },
        raw: true
      })
      .catch(err => err)
    })
    .then( resp => 'user delete successful' )
    .catch( err => err )
}

module.exports = {
  saveUser                  : saveUser,
  saveAllUsers              : saveAllUsers,
  saveUserToStation         : saveUserToStation,
  saveUserToApparatus       : saveUserToApparatus,
  saveUserToDepartment      : saveUserToDepartment,
  getAllUsersByDeptId       : getAllUsersByDeptId,
  getAllUsersByApparatusIds : getAllUsersByApparatusIds,
  getAllUsersByStationIds   : getAllUsersByStationIds,
  getAllUsersByIds          : getAllUsersByIds,
  getAllUserAdminsByDeptId  : getAllUserAdminsByDeptId,
  updateUserAsDeleted       : updateUserAsDeleted,
  updateUserById            : updateUserById,
  deleteUserFromDepartment  : deleteUserFromDepartment,
  deleteUserById            : deleteUserById,
  deleteUserFromStation     : deleteUserFromStation,
  deleteUserFromApparatus   : deleteUserFromApparatus
}
