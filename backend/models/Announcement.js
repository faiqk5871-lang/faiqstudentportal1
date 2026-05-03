const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc: DataTypes.TEXT,
  image: DataTypes.STRING,
  userId: DataTypes.STRING
});

module.exports = Announcement;
