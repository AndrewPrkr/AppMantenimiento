const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
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
    type: DataTypes.STRING(255),
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
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  underscored: true,
  
  // 🔐 AUTOMATIC PASSWORD HASHING HOOKS
  hooks: {
    // ✅ Hash password before creating new user
    beforeCreate: async (user, options) => {
      if (user.password) {
        console.log('🔐 Hashing password for new user:', user.employee_number);
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
        console.log('✅ Password hashed successfully');
      }
    },
    
    // ✅ Hash password before updating user (if password changed)
    beforeUpdate: async (user, options) => {
      // Only hash if password was actually changed
      if (user.changed('password') && user.password) {
        console.log('🔐 Hashing updated password for user:', user.employee_number);
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
        console.log('✅ Password hashed successfully');
      }
    }
  }
});

module.exports = User;
