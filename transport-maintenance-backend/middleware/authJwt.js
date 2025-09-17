const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/user.model');

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole === 'Administrativo') {
    next();
    return;
  }
  res.status(403).send({ message: "Require Admin Role!" });
};

const isMecanico = (req, res, next) => {
  if (req.userRole === 'Mecanico' || req.userRole === 'Administrativo') {
    next();
    return;
  }
  res.status(403).send({ message: "Require Mecanico Role!" });
};

const isOperador = (req, res, next) => {
  if (['Operador', 'Mecanico', 'Administrativo'].includes(req.userRole)) {
    next();
    return;
  }
  res.status(403).send({ message: "Access Denied!" });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isMecanico,
  isOperador
};

module.exports = authJwt;
