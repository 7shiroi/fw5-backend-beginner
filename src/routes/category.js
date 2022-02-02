const category = require('express').Router();

const {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require('../controllers/category');

category.get('/', getCategories);
category.get('/:id', getCategory);
category.post('/', addCategory);
category.patch('/:id', editCategory);
category.delete('/:id', deleteCategory);

module.exports = category;
