/**
 *
 * models/incident_statuses.js
 * table name: incidents
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'incident_statuses',
        {
            inc_status_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            pending: {
                type: Sequelize.DATE,
                allowNull: true
            },
            active: {
                type: Sequelize.DATE,
                allowNull: true
            },
            closed: {
                type: Sequelize.DATE,
                allowNull: true
            },
            cancelled: {
              type: Sequelize.DATE,
              allowNull: true
            },
            filed: {
              type: Sequelize.DATE,
              allowNull: true
            }
        },
        {
            timestamps: false,
            underscored: true,
            getterMethods: {
              id: function () {
                return this.getDataValue('inc_status_id')
              }
            }
        }
    )
}
