const user = require('express').Router();

const {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
} = require('../controllers/user');

user.get('/', getUsers);
user.get('/:id', getUser);
user.post('/', addUser);
user.patch('/:id', editUser);
user.delete('/:id', deleteUser);

module.exports = user;
