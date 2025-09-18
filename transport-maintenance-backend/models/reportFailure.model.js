const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Report = require('./report.model');

const ReportFailure = sequelize.define('ReportFailure', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  report_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Report,
      key: 'id'
    }
  },
  failure_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  failure_type: {
    type: DataTypes.STRING(100),
    comment: 'Set by admin: REPARAR A/C, CAMBIAR LLANTAS, etc.'
  },
  mechanic_feedback: {
    type: DataTypes.TEXT,
    comment: 'What mechanic did to fix it'
  },
  is_resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'report_failures',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Define associations
Report.hasMany(ReportFailure, { foreignKey: 'report_id', as: 'failures' });
ReportFailure.belongsTo(Report, { foreignKey: 'report_id' });

module.exports = ReportFailure;
