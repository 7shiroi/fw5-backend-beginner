const auth = require('express').Router();

const {
  login,
} = require('../controllers/auth');

auth.post('/login', login);

module.exports = auth;
