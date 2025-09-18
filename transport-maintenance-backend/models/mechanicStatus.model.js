const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Report = require('./report.model');

const MechanicStatus = sequelize.define('MechanicStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mechanic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('LIBRE', 'OCUPADO'),
    defaultValue: 'LIBRE'
  },
  current_report_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Report,
      key: 'id'
    }
  }
}, {
  tableName: 'mechanics_status',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at'
});

module.exports = MechanicStatus;