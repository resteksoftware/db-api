/**
 * models/responses_users.js
 *
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'responses_users',
    {
      resp_user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      respond_direct: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      init_resp_timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      init_resp_gps: {
        // needs to allow for null
        type: Sequelize.STRING,
        allowNull: false
      },
      onscene_resp_timestamp: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      onscene_resp_gps: {
        // needs to allow for null
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: false
      },
      closing_resp_timestamp: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: false
      },
      closing_resp_gps: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: false
      }
    },
    {
      timestamps: true,
      underscored: true,
      getterMethods: {
        id: function () {
          return this.getDataValue('resp_user_id')
        }
      }
    }
  )
}
