const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { verifyToken } = require('../middleware/authJwt');

// POST /api/reports - Create new report
router.post('/', [verifyToken], reportsController.createReport);

// GET /api/reports - Get all reports
router.get('/', [verifyToken], reportsController.getReports);

// GET /api/reports/:id - Get single report
router.get('/:id', [verifyToken], reportsController.getReportById);

router.get('/paginated', [verifyToken], reportsController.getReportsPaginated);

module.exports = router;
