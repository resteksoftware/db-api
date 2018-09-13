/**
 * models/track_user_stations.js
 *
 * Join table between stations and users
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
        'departments',
        {
            dept_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            dept_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dept_abbr: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dept_head: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dept_city: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dept_state: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dept_zip: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dept_county: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dept_ip: {
                type: Sequelize.STRING,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        },
        {
            underscored: true,
            timestamps: true,
            getterMethods: {
                id: function() {
                    return this.getDataValue('dept_id')
                }
            }
        }
    )
}
