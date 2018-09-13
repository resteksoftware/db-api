/**
 * models/track_user_departments.js
 *
 * Join table between stations and departments
 *
 * Sequelize will automatically create this table with foreign keys linked to
 * users.user_id and stations.station_id. This is achieved via the
 * belongsToMany commands in the models/index.js file.
 *
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'track_user_departments',
        {
            user_dept_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            }
        },
        {
            timestamps: false,
            getterMethods: {
              id: function () {
                return this.getDataValue('user_dept_id')
              }
            }
        }
    )
}
