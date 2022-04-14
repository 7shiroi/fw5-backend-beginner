const responseHandler = require('../helpers/responseHandler');
const { idValidator, inputValidator } = require('../helpers/validator');
const transactionStatusModel = require('../models/transactionStatus');

const getAllTransactionStatus = async (req, res) => {
  try {
    let { search } = req.query;
    search = search || '';

    const data = { search };

    const results = await transactionStatusModel.getAllTransactionStatus(data);
    if (results.length === 0) {
      return responseHandler(res, 200, 'Transaction status list is empty', []);
    }
    return responseHandler(res, 200, 'Transaction status list', results);
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const getTransactionStatus = async (req, res) => {
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, 'Invalid id format');
    }
    const { id } = req.params;
    const results = await transactionStatusModel.getTransactionStatus(id);
    if (results.length > 0) {
      return responseHandler(res, 200, 'Transaction Status detail', results[0]);
    }
    return responseHandler(res, 404, 'Transaction Status not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const addTransactionStatus = async (req, res) => {
  if (req.user.role > 2) {
    return responseHandler(res, 403, null, null, 'Forbidden! You are not authorized to do this action');
  }
  try {
    const fillable = [
      {
        field: 'name', required: true, type: 'varchar', max_length: 100,
      },
    ];

    const { error, data } = inputValidator(req, fillable);
    if (error.length > 0) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    const transactionStatusCheck = await transactionStatusModel.checkTransactionStatus(data);
    if (transactionStatusCheck[0].checkCount > 0) {
      return responseHandler(res, 400, 'Data already exist!');
    }

    const addTransactionStatusData = await transactionStatusModel.addTransactionStatus(data);
    if (addTransactionStatusData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    const insertedData = await transactionStatusModel
      .getTransactionStatus(addTransactionStatusData.insertId);
    if (insertedData.length > 0) {
      return responseHandler(res, 200, `${addTransactionStatusData.affectedRows} transaction status added`, insertedData);
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const editTransactionStatus = async (req, res) => {
  if (req.user.role > 2) {
    return responseHandler(res, 403, null, null, 'Forbidden! You are not authorized to do this action');
  }
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, 'Invalid id format!');
    }
    const { id } = req.params;
    const results = await transactionStatusModel.getTransactionStatus(id);
    if (results.length === 0) {
      return responseHandler(res, 404, 'Transaction Status not found');
    }
    const fillable = [
      {
        field: 'name', required: true, type: 'varchar', max_length: 100,
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    //   expected body {name}
    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }

    const TransactionStatusCheck = await transactionStatusModel.checkTransactionStatus(data);
    if (TransactionStatusCheck[0].checkCount > 0) {
      return responseHandler(res, 400, 'Data already exist!');
    }

    const updateTransactionStatusData = await transactionStatusModel
      .editTransactionStatus(id, data);
    if (updateTransactionStatusData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unepected Error');
    }
    const updatedData = await transactionStatusModel.getTransactionStatus(id);
    if (updatedData.length > 0) {
      return responseHandler(res, 200, `TransactionStatus with id ${id} has been updated`, updatedData[0]);
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const deleteTransactionStatus = async (req, res) => {
  if (req.user.role > 2) {
    return responseHandler(res, 403, null, null, 'Forbidden! You are not authorized to do this action');
  }
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, 'Invalid id format!');
    }
    const { id } = req.params;
    const results = await transactionStatusModel.getTransactionStatus(id);
    if (results.length === 0) {
      return responseHandler(res, 404, 'Transaction Status not found');
    }

    const deleteTransactionStatusData = await transactionStatusModel
      .deleteTransactionStatus(id);
    if (deleteTransactionStatusData.affectedRows === 1) {
      return responseHandler(res, 200, `TransactionStatus with id ${id} has been deleted`, results);
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

module.exports = {
  getAllTransactionStatus,
  getTransactionStatus,
  addTransactionStatus,
  editTransactionStatus,
  deleteTransactionStatus,
};
