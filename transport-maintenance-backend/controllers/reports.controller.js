const Report = require('../models/report.model');
const ReportFailure = require('../models/reportFailure.model');
const User = require('../models/user.model');
const sequelize = require('../config/database');

// Create a new report
const createReport = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { vehicle_type, vehicle_id, vehicle_number, equipment_type, failures } = req.body;
    const operator_id = req.userId;
    
    console.log('Creating report with data:', { vehicle_type, vehicle_id, vehicle_number, equipment_type, failures }); // Debug
    
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

    console.log('Report created with ID:', report.id); // Debug

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
      include: [{
        model: ReportFailure,
        as: 'failures'
      }]
    });

    console.log('Report created successfully:', completeReport.report_number); // Debug
    res.status(201).json(completeReport);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating report:', error); // Debug
    res.status(500).json({ message: error.message });
  }
};

// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [{
        model: ReportFailure,
        as: 'failures'
      }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error); // Debug
    res.status(500).json({ message: error.message });
  }
};

// Get single report
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id, {
      include: [{
        model: ReportFailure,
        as: 'failures'
      }]
    });
    
    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }
    
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error); // Debug
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById
};
