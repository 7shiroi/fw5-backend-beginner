const category = require('express').Router();
const cors = require('cors');
const { verifyUser } = require('../helpers/auth');

const {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require('../controllers/category');

const corsOptions = {
  origin: 'http://localhost:3000',
};

category.get('/', cors(corsOptions), getCategories);
category.get('/:id', cors(corsOptions), getCategory);
category.post('/', verifyUser, addCategory);
category.patch('/:id', verifyUser, editCategory);
category.delete('/:id', verifyUser, deleteCategory);

module.exports = category;
