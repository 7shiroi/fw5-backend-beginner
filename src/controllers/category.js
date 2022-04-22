/* eslint-disable consistent-return */
const categoryModel = require('../models/category');
const responseHandler = require('../helpers/responseHandler');
const { idValidator, inputValidator } = require('../helpers/validator');

const getCategories = async (req, res) => {
  try {
    let { search, page, limit } = req.query;
    search = search || '';
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;
    const offset = (page - 1) * limit;
    const data = { search, offset, limit };

    const count = await categoryModel.getCategoryCountAsync(data);
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await categoryModel.getCategoriesAsync(data);
      if (results.length > 0) {
        const pageInfo = {
          prev: page > 1 ? `${APP_URL}/category?search=${search}&page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `${APP_URL}/category?search=${search}&page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        return responseHandler(res, 200, 'List Categories', results, null, pageInfo);
      }
      return res.status(404).json({
        success: false,
        message: 'List not found',
      });
    }
    return res.status(404).json({
      success: false,
      message: 'List not found',
    });
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const getCategory = async (req, res) => {
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, 'Invalid id format');
    }
    const { id } = req.params;
    const results = await categoryModel.getCategoryAsync(id);
    if (results.length > 0) {
      return responseHandler(res, 200, 'Detail Category', results[0]);
    }
    return responseHandler(res, 404, 'Category not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const addCategory = async (req, res) => {
  if (req.user.role > 2) {
    return responseHandler(res, 403, null, null, 'Forbidden! You are not authorized to do this action');
  }
  try {
    const fillable = [
      {
        field: 'name', required: true, type: 'varchar', max_length: 80,
      },
    ];

    const { error, data } = inputValidator(req, fillable);
    if (error.length > 0) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    const categoryCheck = await categoryModel.checkCategoryAsync(data);
    if (categoryCheck[0].checkCount > 0) {
      return responseHandler(res, 400, 'Data already exist!');
    }

    const addCategoryData = await categoryModel.addCategoryAsync(data);
    if (addCategoryData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    const insertedData = await categoryModel.getCategoryAsync(addCategoryData.insertId);
    if (insertedData.length > 0) {
      return responseHandler(res, 200, `${addCategoryData.affectedRows} category added`, insertedData);
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const editCategory = async (req, res) => {
  if (req.user.role > 2) {
    return responseHandler(res, 403, null, null, 'Forbidden! You are not authorized to do this action');
  }
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, 'Invalid id format!');
    }
    const { id } = req.params;
    const results = await categoryModel.getCategoryAsync(id);
    if (results.length === 0) {
      return responseHandler(res, 404, 'Category not found');
    }
    const fillable = [
      {
        field: 'name', required: true, type: 'varchar', max_length: 80,
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    //   expected body {name}
    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }

    const categoryCheck = await categoryModel.checkCategoryAsync(data);
    if (categoryCheck[0].checkCount > 0) {
      return responseHandler(res, 400, 'Data already exist!');
    }

    const updateCategoryData = await categoryModel.editCategoryAsync(id, data);
    if (updateCategoryData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unepected Error');
    }
    const updatedData = await categoryModel.getCategoryAsync(id);
    if (updatedData.length > 0) {
      return responseHandler(res, 200, `Category with id ${id} has been updated`, updatedData[0]);
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const deleteCategory = async (req, res) => {
  if (req.user.role > 2) {
    return responseHandler(res, 403, null, null, 'Forbidden! You are not authorized to do this action');
  }
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, 'Invalid id format!');
    }
    const { id } = req.params;
    const results = await categoryModel.getCategoryAsync(id);
    if (results.length === 0) {
      return responseHandler(res, 404, 'Category not found');
    }

    const deleteCategoryData = await categoryModel.deleteCategoryAsync(id);
    if (deleteCategoryData.affectedRows === 1) {
      return responseHandler(res, 200, `Category with id ${id} has been deleted`, results);
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
};
