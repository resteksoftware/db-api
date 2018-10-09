/**
 * models/user/user.js
 *
 * Enter phone number as 5553451212
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users',
    {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      mobile_num: {
        type: Sequelize.STRING,
        validate: {
          isAlphanumeric: true,
          len: [10,11]
        },
        allowNull: false
      },
      carrier_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      device_os: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rank: {
        type: Sequelize.STRING,
        allowNull: false
      },
      default_station: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_driver: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_enabled: {
        // admin sets this
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_sleeping: {
        // user sets this
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_admin: {
        // admin sets this
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_deleted: {
        // admin sets this
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_career: {
        // admin sets this
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_engine: {
        // admin sets this
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_volley: {
        // admin sets this
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        validate: {
          isDate: true
        },
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        validate: {
          isDate: true
        },
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: true,
      getterMethods: {
        full_name: function () {
          return this.first_name + ' ' + this.last_name
        },
        id: function () {
          return this.getDataValue('user_id')
        }
      }
    }
  )
}
