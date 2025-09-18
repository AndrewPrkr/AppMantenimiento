const express = require('express');
const router = express.Router();
const fleetController = require('../controllers/fleet.controller');
const { verifyToken } = require('../middleware/authJwt');

// GET /api/fleet/trucks
router.get('/trucks', [verifyToken], fleetController.getTrucks);

// GET /api/fleet/remolques
router.get('/remolques', [verifyToken], fleetController.getRemolques);

module.exports = router;