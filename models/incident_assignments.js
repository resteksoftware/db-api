/**
 *
 * models/incident_assignments.js
 * table name: incident_assignments
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'incident_assignments',
        {
            inc_assignment_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            assignment: {
                type: Sequelize.STRING,
                allowNull: true
            }
        },
        {
            timestamps: false,
            underscored: true,
            getterMethods: {
              id: function () {
                  return this.getDataValue('inc_assignment_id')
                }
            }
        }
    )
}
