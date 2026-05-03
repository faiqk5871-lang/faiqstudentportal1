const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  workshopId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  workshopTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: DataTypes.STRING,
  fatherName: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  class: DataTypes.STRING,
  institute: DataTypes.STRING,
  paymentScreenshot: DataTypes.STRING,
  userId: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  }
});

module.exports = Application;
