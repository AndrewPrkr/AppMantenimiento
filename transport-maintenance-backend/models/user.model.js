const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_number: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),  // ✅ PERFECTO para bcrypt hashes
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Operador', 'Mecanico', 'Administrativo'),
    allowNull: false,
    defaultValue: 'Operador'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',           // ✅ Nombre exacto de tu tabla
  timestamps: true,             // ✅ Habilita timestamps automáticos
  createdAt: 'created_at',      // ✅ Mapea a tu columna created_at
  updatedAt: false,            // ✅ CRÍTICO - desactiva updatedAt (no existe en tu DB)
  underscored: true            // ✅ Convierte camelCase a snake_case
});

module.exports = User;