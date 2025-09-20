const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { verifyToken } = require('../middleware/authJwt');

router.post('/', verifyToken, reportsController.createReport);
router.get('/paginated', verifyToken, reportsController.getReportsPaginated);
router.get('/:id', verifyToken, reportsController.getReportById);

module.exports = router;
