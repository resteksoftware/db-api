/**
 *
 * models/incident_remarks.js
 * table name: incident_remarks
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'incident_remarks',
        {
            inc_remark_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            remark: {
                type: Sequelize.STRING,
                allowNull: true
            }
        },
        {
            timestamps: false,
            underscored: true,
            getterMethods: {
              id: function () {
                return this.getDataValue('inc_remark_id')
              }
            }
        }
    )
}
