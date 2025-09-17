// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const User = require('../models/user.model'); // ✅ Importar modelo

// Ruta existente de signin
router.post('/signin', controller.signin);

// ✅ NUEVA RUTA PARA TESTING - Obtener todos los usuarios
router.get('/test/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'employee_number', 'full_name', 'role', 'is_active', 'created_at']
    });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// ✅ NUEVA RUTA PARA TESTING - Obtener usuario específico
router.get('/test/user/:employee_number', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { employee_number: req.params.employee_number },
      attributes: ['id', 'employee_number', 'full_name', 'role', 'is_active', 'created_at']
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

module.exports = router;