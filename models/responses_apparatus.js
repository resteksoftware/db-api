/**
 * models/responses_apparatus.js
 *
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'responses_apparatus',
    {
      resp_app_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      init_resp_timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      init_resp_gps: {
        type: Sequelize.STRING,
        allowNull: false
      },
      onscene_resp_timestamp: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: false
      },
      onscene_resp_gps: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      closing_resp_timestamp: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: false
      },
      closing_resp_gps: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      timestamps: true,
      underscored: true,
      getterMethods: {
        id: function () {
          return this.getDataValue('resp_app_id')
        }
      }
    }
  )
}
