/**
 * models/apparatus.js
 *
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'apparatus',
    {
      app_id: {
        // E5
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      app_name: {
        // Engine 5
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      app_abbr: {
        // E5
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null
      },
      is_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
      timestamps: true,
      underscored: true,
      getterMethods: {
          id: function() {
              return this.getDataValue('app_id')
          }
      }
    }
  )
}
