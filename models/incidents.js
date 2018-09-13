/**
 *
 * models/incidents.js
 * table name: incidents
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'incidents',
    {
      inc_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      inc_status_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dept_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fd_dispatch_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'py2f7hq7'
      },
      timeout: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: null
      },
      radio_freq: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      inc_category: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      inc_description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      inc_type_code: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      apt_no: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      location_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      location_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      zip: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      cross_street: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      map_ref: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      latitude: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      longitude: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      hot_zone: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      warm_zone: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      test_call: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      timestamps: false,
      underscored: true,
      getterMethods: {
        id: function () {
            return this.getDataValue('inc_id')
          },
        inc_status_id: function () {
          return this.getDataValue('inc_status_id')
        }  
      }
    }
  )
}
