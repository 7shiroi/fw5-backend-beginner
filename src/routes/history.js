const history = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getHistories,
  getHistory,
  addHistory,
  editHistory,
  deleteHistory,
} = require('../controllers/history');

history.get('/', verifyUser, getHistories);
history.get('/:id', verifyUser, getHistory);
history.post('/', verifyUser, addHistory);
history.patch('/:id', verifyUser, editHistory);
history.delete('/:id', verifyUser, deleteHistory);

module.exports = history;
