const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Truck = sequelize.define('Truck', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  truck_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(100)
  },
  model: {
    type: DataTypes.STRING(100)
  },
  year: {
    type: DataTypes.INTEGER
  },
  plate: {
    type: DataTypes.STRING(20)
  },
  status: {
    type: DataTypes.ENUM('Disponible', 'En_Mantenimiento', 'Fuera_Servicio'),
    defaultValue: 'Disponible'
  }
}, {
  tableName: 'trucks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Truck;