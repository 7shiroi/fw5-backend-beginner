const history = require('express').Router();
const cors = require('cors');
const { verifyUser } = require('../helpers/auth');

const {
  getHistories,
  getHistory,
  addHistory,
  editHistory,
  deleteHistory,
} = require('../controllers/history');

const corsOptions = {
  origin: 'http://localhost:3000',
};

history.get('/', cors(corsOptions), verifyUser, getHistories);
history.get('/:id', cors(corsOptions), verifyUser, getHistory);
history.post('/', cors(corsOptions), verifyUser, addHistory);
history.patch('/:id', cors(corsOptions), verifyUser, editHistory);
history.delete('/:id', cors(corsOptions), verifyUser, deleteHistory);

module.exports = history;
