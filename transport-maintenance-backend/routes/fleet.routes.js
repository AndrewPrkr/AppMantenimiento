const express = require('express');
const router = express.Router();
const fleetController = require('../controllers/fleet.controller');

router.get('/trucks', fleetController.getTrucks);
router.get('/remolques', fleetController.getRemolques);

module.exports = router;
