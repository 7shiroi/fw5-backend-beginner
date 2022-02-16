const auth = require('express').Router();
const { verifyUser: verifyUserHelper } = require('../helpers/auth');

const {
  login, register, forgotPassword, verifyUser,
} = require('../controllers/auth');

auth.post('/login', login);
auth.post('/register', register);
auth.post('/forgotPassword', forgotPassword);
auth.post('/verifyUser', verifyUserHelper, verifyUser);

module.exports = auth;
