const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Remolque = sequelize.define('Remolque', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  remolque_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('VOLTEO', 'PIPA', 'PLATAFORMA'),
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
  tableName: 'remolques',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Remolque;