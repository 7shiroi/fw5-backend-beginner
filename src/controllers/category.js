/* eslint-disable consistent-return */
const categoryModel = require('../models/category');

const getCategories = (req, res) => {
  let { search, page, limit } = req.query;
  search = search || '';
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 5;
  const offset = (page - 1) * limit;
  const data = { search, offset, limit };
  categoryModel.getCategoryCount(data, (count) => {
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      categoryModel.getCategories(data, (results) => {
        if (results.length > 0) {
          return res.json({
            success: true,
            message: 'List Categories',
            pageInfo: {
              prev: page > 1 ? `http://localhost:5000/category?search=${search}&page=${page - 1}&limit=${limit}` : null,
              next: page < lastPage ? `http://localhost:5000/category?search=${search}&page=${page + 1}&limit=${limit}` : null,
              totalData: rowsCount,
              currentPage: page,
              lastPage,
            },
            results,
          });
        }
        return res.status(404).json({
          success: false,
          message: 'List not found',
        });
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'List not found',
      });
    }
  });
};

const getCategory = (req, res) => {
  const { id } = req.params;
  categoryModel.getCategory(id, (results) => {
    if (results.length > 0) {
      return res.json({
        success: true,
        message: 'Detail Category',
        results: results[0],
      });
    }
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  });
};

// eslint-disable-next-line require-jsdoc
function validateDataCategory(data) {
  // expected data {name, color, location, stock, price, capacity, is_available(0,1),
  // has_repayment(0,1), reservation_deadline check string format (00.00)}
  const error = [];

  if (data.name === undefined || data.name.length === 0) {
    error.push('Input parameter nama salah!');
  }
  if (data.name === undefined || data.name.length > 80) {
    error.push('Input nama terlalu panjang!');
  }
  return error;
}

const addCategory = (req, res) => {
  const data = req.body;
  const error = validateDataCategory(data);
  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  categoryModel.checkCategory(data, (result) => {
    if (result[0].checkCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Data sudah ada!',
      });
    }

    categoryModel.addCategory(data, (results) => res.json({
      success: true,
      message: `${results.affectedRows} category added`,
      results: data,
    }));
  });
};

const editCategory = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  //   expected body {name}
  const error = validateDataCategory(data);
  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  categoryModel.checkCategory(data, (result) => {
    if (result[0].checkCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Data sudah ada!',
      });
    }

    categoryModel.getCategory(id, (results) => {
      if (results.length > 0) {
        categoryModel.editCategory(id, data, () => res.json({
          success: true,
          message: `Category with id ${id} has been updated`,
          results: data,
        }));
      } else {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
    });
  });
};

const deleteCategory = (req, res) => {
  const { id } = req.params;

  categoryModel.getCategory(id, (results) => {
    if (results.length > 0) {
      categoryModel.deleteCategory(id, () => res.json({
        succes: true,
        message: `Category with id ${id} has been deleted`,
        data: results,
      }));
    } else {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
  });
};

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
};
