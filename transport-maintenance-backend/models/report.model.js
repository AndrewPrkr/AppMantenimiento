const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  report_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  vehicle_type: {
    type: DataTypes.ENUM('TRACTO', 'REMOLQUE'),
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vehicle_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  equipment_type: {
    type: DataTypes.STRING(50)
  },
  operator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  operator_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('REVISION', 'ASIGNADO', 'FINALIZADO'),
    defaultValue: 'REVISION'
  },
  assigned_mechanic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  assigned_mechanic_name: {
    type: DataTypes.STRING(255)
  },
  assigned_at: {
    type: DataTypes.DATE
  },
  completed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'reportes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Report;