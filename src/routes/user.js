const user = require('express').Router();
const { verifyUser } = require('../helpers/auth');
const uploadImage = require('../helpers/upload');

const {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
} = require('../controllers/user');

user.get('/', getUsers);
user.get('/:id', getUser);
user.post('/', verifyUser, uploadImage('picture'), addUser);
user.patch('/:id', verifyUser, uploadImage('picture'), editUser);
user.delete('/:id', verifyUser, deleteUser);

module.exports = user;
