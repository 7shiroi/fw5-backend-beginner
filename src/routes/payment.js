const auth = require('express').Router();
// const cors = require('cors');
const { verifyUser } = require('../helpers/auth');

const {
  payment,
} = require('../controllers/payment');

auth.post('/', verifyUser, payment);

module.exports = auth;
