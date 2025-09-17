const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Truck = sequelize.define('Truck', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  truck_number: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  status: { type: DataTypes.ENUM('active', 'in_maintenance', 'decommissioned'), defaultValue: 'active' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'trucks',
  timestamps: false,
  underscored: true
});

module.exports = Truck;
