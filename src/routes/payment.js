const auth = require('express').Router();
// const cors = require('cors');
const { verifyUser } = require('../helpers/auth');

const {
  payment, successPayment,
} = require('../controllers/payment');

auth.post('/', verifyUser, payment);
auth.post('/success', verifyUser, successPayment);

module.exports = auth;
