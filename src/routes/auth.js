const auth = require('express').Router();

const {
  login, register, forgotPassword,
} = require('../controllers/auth');

auth.post('/login', login);
auth.post('/register', register);
auth.post('/forgotPassword', forgotPassword);

module.exports = auth;
