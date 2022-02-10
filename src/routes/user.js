const user = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
} = require('../controllers/user');

user.get('/', getUsers);
user.get('/:id', getUser);
user.post('/', verifyUser, addUser);
user.patch('/:id', verifyUser, editUser);
user.delete('/:id', verifyUser, deleteUser);

module.exports = user;
