const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/user.model');

const signin = async (req, res) => {
  try {
    const { employee_number, password } = req.body;

    const user = await User.findOne({
      where: { 
        employee_number: employee_number,
        is_active: true 
      }
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "!"
      });
    }

    const token = jwt.sign({ 
      id: user.id, 
      role: user.role,
      employee_number: user.employee_number 
    }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    res.status(200).send({
      id: user.id,
      employee_number: user.employee_number,
      full_name: user.full_name,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const signout = async (req, res) => {
  try {
    res.status(200).send({ message: "You've been signed out!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  signin,
  signout
};