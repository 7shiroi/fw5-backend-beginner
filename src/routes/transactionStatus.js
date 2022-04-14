const transactionStatus = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getAllTransactionStatus,
  getTransactionStatus,
  addTransactionStatus,
  editTransactionStatus,
  deleteTransactionStatus,
} = require('../controllers/transactionStatus');

transactionStatus.get('/', getAllTransactionStatus);
transactionStatus.get('/:id', getTransactionStatus);
transactionStatus.post('/', verifyUser, addTransactionStatus);
transactionStatus.patch('/:id', verifyUser, editTransactionStatus);
transactionStatus.delete('/:id', verifyUser, deleteTransactionStatus);

module.exports = transactionStatus;
