const Report = require('../models/report.model');
const ReportFailure = require('../models/reportFailure.model');
const User = require('../models/user.model');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Create a new report
const createReport = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { vehicle_type, vehicle_id, vehicle_number, equipment_type, failures } = req.body;
    const operator_id = req.userId;

    // Get operator info
    const operator = await User.findByPk(operator_id);
    if (!operator) {
      await transaction.rollback();
      return res.status(404).json({ message: "Operator not found." });
    }

    // Validate that failures array is not empty
    if (!failures || failures.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "At least one failure must be reported." });
    }

    // Create the report (report_number will be auto-generated)
    const report = await Report.create({
      report_number: `RPT-${Date.now()}`, // Temporary, will be replaced by trigger if exists
      vehicle_type,
      vehicle_id,
      vehicle_number,
      equipment_type,
      operator_id,
      operator_name: operator.full_name,
      status: 'REVISION'
    }, { transaction });

    // Create failures
    const failurePromises = failures.map(failure => {
      return ReportFailure.create({
        report_id: report.id,
        failure_description: failure.failure_description
      }, { transaction });
    });

    await Promise.all(failurePromises);
    await transaction.commit();

    // Fetch the complete report with failures
    const completeReport = await Report.findByPk(report.id, {
      include: [{ model: ReportFailure, as: 'failures' }]
    });

    res.status(201).json(completeReport);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

// Paginated & filtered fetch
const getReportsPaginated = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, status, date } = req.query;
    let where = {};

    // If not admin, only show own reportes
    if (req.userRole !== 'Administrativo') {
      where.operator_id = req.userId;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (date) {
      // Example date: "2025-09-09"
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.created_at = { [Op.between]: [start, end] };
    }

    const count = await Report.count({ where });
    const totalPages = Math.max(1, Math.ceil(count / pageSize));

    const reports = await Report.findAll({
      where,
      include: [{ model: ReportFailure, as: 'failures' }],
      order: [['created_at', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize)
    });

    res.status(200).json({
      reports,
      totalPages,
      currentPage: parseInt(page),
      totalReports: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single report
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id, {
      include: [{ model: ReportFailure, as: 'failures' }]
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getReportsPaginated,
  getReportById
};
