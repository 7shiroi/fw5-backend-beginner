const category = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require('../controllers/category');

category.get('/', getCategories);
category.get('/:id', getCategory);
category.post('/', verifyUser, addCategory);
category.patch('/:id', verifyUser, editCategory);
category.delete('/:id', verifyUser, deleteCategory);

module.exports = category;
