const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Remolque = sequelize.define('Remolque', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  remolque_number: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  type: { type: DataTypes.ENUM('volteo', 'pipa', 'plataforma'), allowNull: false },
  status: { type: DataTypes.ENUM('active', 'in_maintenance', 'decommissioned'), defaultValue: 'active' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'remolques',
  timestamps: false,
  underscored: true
});

module.exports = Remolque;
