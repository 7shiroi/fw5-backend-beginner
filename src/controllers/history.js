/* eslint-disable consistent-return */
const responseHandler = require('../helpers/responseHandler');
const { inputValidator, idValidator, compareDate } = require('../helpers/validator');
const historyModel = require('../models/history');
const userModel = require('../models/user');
const vehicleModel = require('../models/vehicle');

const { APP_URL } = process.env;

const getHistories = async (req, res) => {
  try {
    let {
      search, page, limit, lastCreated,
    } = req.query;
    search = search || '';
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;
    if (parseInt(lastCreated, 10) >= 0) {
      lastCreated = parseInt(lastCreated, 10);
    } else {
      lastCreated = 30;
    }
    const offset = (page - 1) * limit;
    const data = {
      search, limit, offset, lastCreated,
    };

    if (req.user.role > 2) {
      data.id_user = req.user.id;
    }

    const count = await historyModel.getHistoriesCountAsync(data);
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await historyModel.getHistoriesAsync(data);
      if (results.length > 0) {
        const mapResults = results.map((o) => {
          if (o.image !== null) {
          // eslint-disable-next-line no-param-reassign
            o.image = `${APP_URL}/${o.image}`;
          }
          return o;
        });
        const pageInfo = {
          prev: page > 1 ? `http://localhost:5000/history?search=${search}&page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `http://localhost:5000/history?search=${search}&page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        return responseHandler(res, 200, 'List histories', mapResults, null, pageInfo);
      }
      return responseHandler(res, 400, 'List not found', results);
    }
    return responseHandler(res, 400, 'List not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const getHistory = async (req, res) => {
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid Id Format!');
    }
    const { id } = req.params;

    let idUser = null;
    if (req.user.role > 2) {
      idUser = req.user.id;
    }

    const results = await historyModel.getHistoryAsync(id, idUser);
    if (results.length > 0) {
      return responseHandler(res, 200, 'Detail history', results[0]);
    }
    return responseHandler(res, 400, null, null, `History with id ${id} not found!`);
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const addHistory = async (req, res) => {
  try {
    const fillable = [
      {
        field: 'id_user', required: true, type: 'integer',
      },
      {
        field: 'id_vehicle', required: true, type: 'integer',
      },
      {
        field: 'quantity', required: true, type: 'integer',
      },
      {
        field: 'date_start', required: true, type: 'date',
      },
      {
        field: 'date_end', required: true, type: 'date',
      },
      {
        field: 'has_returned', required: false, type: 'boolean',
      },
      {
        field: 'prepayment', required: false, type: 'price',
      },
    ];

    const { error, data } = inputValidator(req, fillable);

    if (compareDate(data.date_start, data.date_end) === 1) {
      error.push('Cannot set start date before end date!');
    }

    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }

    const checkUser = await userModel.getUserAsync(data.id_user);
    if (checkUser.length === 0) {
      return responseHandler(res, 400, null, null, `User with id ${data.id_user} is not found`);
    }

    const checkVehicle = await vehicleModel.getVehicleAsync(data.id_vehicle);
    if (checkVehicle.length === 0) {
      return responseHandler(res, 400, null, null, `Vehicle with id ${data.id_vehicle} is not found`);
    }

    if (checkVehicle[0].is_available === 0) {
      return responseHandler(res, 400, null, null, `Vehicle with id ${data.id_vehicle} is not available`);
    }

    const maxPrepayment = checkVehicle[0].price;
    const minPrepayment = checkVehicle[0].price * (20 / 100);
    if (checkVehicle[0].has_prepayment === 1) {
      if (
        data.prepayment === undefined
          || data.prepayment < minPrepayment
      ) {
        return responseHandler(res, 400, null, null, `Invalid prepayment: minimal ${minPrepayment}`);
      }
    }
    if (data.prepayment > maxPrepayment) {
      return responseHandler(res, 400, null, null, `Invalid prepayment: maximal ${maxPrepayment}`);
    }

    const addHistoryData = await historyModel.addHistoryAsync(data);
    if (addHistoryData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    const insertedData = await historyModel.getHistoryAsync(addHistoryData.insertId);
    if (insertedData.length === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    return responseHandler(res, 201, 'History data created', insertedData);
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const editHistory = async (req, res) => {
  if (req.user.role > 2) {
    return responseHandler(res, 403, null, null, 'You are not authorized to do this action');
  }
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid Id Format!');
    }

    const { id } = req.params;

    const historyData = await historyModel.getHistoryAsync(id);
    if (historyData.length === 0) {
      return responseHandler(res, 400, null, null, `History with id ${id} is not found`);
    }
    let { date_start: dateStart, date_end: dateEnd } = historyData[0];
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    const fillable = [
      {
        field: 'id_user', required: false, type: 'integer',
      },
      {
        field: 'id_vehicle', required: false, type: 'integer',
      },
      {
        field: 'quantity', required: false, type: 'integer',
      },
      {
        field: 'date_start', required: false, type: 'date',
      },
      {
        field: 'date_end', required: false, type: 'date',
      },
      {
        field: 'has_returned', required: false, type: 'boolean',
      },
      {
        field: 'prepayment', required: false, type: 'price',
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    if (data.date_start) {
      dateStart = data.date_start;
    }
    if (data.date_end) {
      dateEnd = data.date_end;
    }

    if (compareDate(dateStart, dateEnd) === 1) {
      error.push('Cannot set start date before end date!');
    }
    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }
    if (data.id_user) {
      const checkUser = await userModel.getUserAsync(data.id_user);
      if (checkUser.length === 0) {
        return responseHandler(res, 400, null, null, `User with id ${data.id_user} is not found`);
      }
    }

    if (data.id_vehicle) {
      const checkVehicle = await vehicleModel.getVehicleAsync(data.id_vehicle);
      if (checkVehicle.length === 0) {
        return responseHandler(res, 400, null, null, `Vehicle with id ${data.id_vehicle} is not found`);
      }
      if (checkVehicle[0].is_available === 0) {
        return responseHandler(res, 400, null, null, `Vehicle with id ${data.id_vehicle} is not available`);
      }

      const maxPrepayment = checkVehicle[0].price;
      const minPrepayment = checkVehicle[0].price * (20 / 100);
      if (checkVehicle[0].has_prepayment === 1) {
        if (
          data.prepayment === undefined
              || data.prepayment < minPrepayment
        ) {
          return responseHandler(res, 400, null, null, `Invalid prepayment: minimal ${minPrepayment}`);
        }
      }
      if (data.prepayment > maxPrepayment) {
        return responseHandler(res, 400, null, null, `Invalid prepayment: maximal ${maxPrepayment}`);
      }
    } else if (data.prepayment) {
      const checkVehicle = await vehicleModel.getVehicleAsync(historyData.id_vehicle);
      if (checkVehicle.length === 0) {
        return responseHandler(res, 500, null, null, 'Unexpected Error');
      }
      const maxPrepayment = checkVehicle[0].price;
      const minPrepayment = checkVehicle[0].price * (20 / 100);
      if (checkVehicle[0].has_prepayment === 1) {
        if (
          data.prepayment === undefined
                || data.prepayment < minPrepayment
        ) {
          return responseHandler(res, 400, null, null, `Invalid prepayment: minimal ${minPrepayment}`);
        }
      }
      if (data.prepayment > maxPrepayment) {
        return responseHandler(res, 400, null, null, `Invalid prepayment: maximal ${maxPrepayment}`);
      }
    }

    const editHistoryData = await historyModel.editHistoryAsync(id, data);
    if (editHistoryData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    const updatedData = await historyModel.getHistoryAsync(id);
    if (updatedData.length === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    return responseHandler(res, 200, 'History data has been updated', updatedData);
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const deleteHistory = async (req, res) => {
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid Id Format!');
    }
    const { id } = req.params;

    const historyData = await historyModel.getHistoryAsync(id);
    if (historyData.length === 0) {
      return responseHandler(res, 400, null, null, `History with id ${id} is not found`);
    }

    if (req.user.role > 2 && historyData[0].id_user !== req.user.id) {
      return responseHandler(res, 403, null, null, 'You are not authorized to do this action');
    }
    const deleteHistoryData = await historyModel.deleteHistoryAsync(id);
    if (deleteHistoryData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    return responseHandler(res, 200, `History with id ${id} has been deleted`, historyData);
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

module.exports = {
  getHistories,
  getHistory,
  addHistory,
  editHistory,
  deleteHistory,
};
