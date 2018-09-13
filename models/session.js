/**
 * models/sessions.js
 *
 */
'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'sessions',
    {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      expires: Sequelize.DATE,
      data: Sequelize.STRING(50000)
    }
  )
}
