const auth = require('express').Router();
const cors = require('cors');
const { verifyUser: verifyUserHelper } = require('../helpers/auth');

const {
  login, register, forgotPassword, verifyUser,
} = require('../controllers/auth');

const corsOptions = {
  origin: 'http://localhost:3000',
};

auth.post('/login', cors(corsOptions), login);
auth.post('/register', cors(corsOptions), register);
auth.post('/forgotPassword', cors(corsOptions), forgotPassword);
auth.post('/verifyUser', cors(corsOptions), verifyUserHelper, verifyUser);

module.exports = auth;
