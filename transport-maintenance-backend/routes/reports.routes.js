const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { verifyToken, isOperador, isAdmin, isMecanico } = require('../middleware/authJwt');

// POST /api/reports - Create new report (Operators only)
router.post('/', [verifyToken, isOperador], reportsController.createReport);

// GET /api/reports - Get all reports
router.get('/', [verifyToken], reportsController.getReports);

// GET /api/reports/status/:status - Get reports by status
router.get('/status/:status', [verifyToken], reportsController.getReportsByStatus);

// GET /api/reports/:id - Get single report
router.get('/:id', [verifyToken], reportsController.getReportById);

// PUT /api/reports/:id - Update report (Admin/Mechanic)
router.put('/:id', [verifyToken], reportsController.updateReport);

// PUT /api/reports/failure/:id - Update failure (Admin/Mechanic)
router.put('/failure/:id', [verifyToken], reportsController.updateFailure);

// GET /api/reports/mechanics/available - Get available mechanics (Admin only)
router.get('/mechanics/available', [verifyToken, isAdmin], reportsController.getAvailableMechanics);

module.exports = router;