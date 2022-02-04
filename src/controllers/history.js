/* eslint-disable consistent-return */
const historyModel = require('../models/history');
const userModel = require('../models/user');
const vehicleModel = require('../models/vehicle');

const getHistories = (req, res) => {
  let {
    vehicleName, email, page, limit,
  } = req.query;
  vehicleName = vehicleName || '';
  email = email || '';
  page = page || 1;
  limit = limit || 5;
  const offset = (page - 1) * limit;
  const data = {
    vehicleName, email, limit, offset,
  };

  historyModel.getHistoriesCount(data, (count) => {
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      historyModel.getHistories(data, (results) => {
        if (results.length > 0) {
          return res.json({
            success: true,
            message: 'List Histories',
            pageInfo: {
              prev: page > 1 ? `http://localhost:5000/history?vehicleName=${vehicleName}&email=${email}&page=${page - 1}&limit=${limit}` : null,
              next: page < lastPage ? `http://localhost:5000/history?vehicleName=${vehicleName}&email=${email}&page=${page + 1}&limit=${limit}` : null,
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

const getHistory = (req, res) => {
  const { id } = req.params;
  historyModel.getHistory(id, (results) => {
    if (results.length > 0) {
      return res.json({
        success: true,
        message: 'Detail History',
        results: results[0],
      });
    }
    return res.status(404).json({
      success: false,
      message: 'History not found',
    });
  });
};

const checkPriceFormat = (data) => /^[^-0+]\d+.\d{2}?$/.test(data) || /^0$/.test(data);
const dateValidation = (data) => /^[^0]\d{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(data);
const idValidation = (data) => /^[0-9]+$/.test(data);
const compareDate = (start, end) => {
  const dateStart = new Date(start);
  const dateEnd = new Date(end);
  if (dateStart < dateEnd) {
    return -1;
  }
  if (dateStart > dateEnd) {
    return 1;
  }
  return 0;
};

const cekUser = (data) => new Promise((resolve, reject) => {
  userModel.getUser(data.id_user, (res) => {
    if (res.length > 0) {
      resolve();
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('User tidak ditemukan');
    }
  });
});

const cekVehicle = (data) => new Promise((resolve, reject) => {
  vehicleModel.getVehicle(data.id_vehicle, (res) => {
    if (res.length > 0) {
      resolve();
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('Kendaraan tidak ditemukan');
    }
  });
});

// eslint-disable-next-line require-jsdoc
function validateDataHistory(data) {
  // expected data {id_user (fk), id_vehicle (fk), date_start, date_end,
  // has_returned, prepayment (nullable)}
  const error = [];
  // todo make promise version for id validation
  if (
    data.id_user === undefined
    || !idValidation(data.id_user)
    || parseInt(data.id_user, 10) <= 0
  ) {
    error.push('Input parameter id_user salah!');
  }
  // else {
  //   userModel.getUser(data.id_user, (res) => {
  //     if (res.length === 0) {
  //       error.push('User tidak ditemukan');
  //     }
  //   });
  // }
  if (
    data.id_vehicle === undefined
    || !idValidation(data.id_vehicle)
    || parseInt(data.id_vehicle, 10) <= 0) {
    error.push('Input parameter id_vehicle salah!');
  }
  // else {
  //   vehicleModel.getVehicle(data.id_vehicle, (res) => {
  //     if (res.length === 0) {
  //       error.push('Kendaraan tidak ditemukan');
  //     }
  //   });
  // }
  if (data.date_start === undefined || !dateValidation(data.date_start)) {
    error.push('Input parameter date_start salah!');
  } else if (data.date_end === undefined || !dateValidation(data.date_end)) {
    error.push('Input parameter date_end salah!');
  } else if (compareDate(data.date_start, data.date_end) === 1) {
    error.push('date_end harus lebih besar dari date_start!');
  }
  if (
    data.has_returned !== undefined
    && (parseInt(data.has_returned, 10) < 0 || parseInt(data.has_returned, 10) > 1)
  ) {
    error.push('Input parameter has_returned salah!');
  }
  if (
    data.prepayment !== undefined
    && !checkPriceFormat(data.prepayment)
  ) {
    error.push('Input parameter prepayment salah!');
  }

  return error;
}

const addHistory = (req, res) => {
  const data = req.body;
  const error = validateDataHistory(data);
  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  cekUser(data).then(() => {
    cekVehicle(data).then(() => {
      vehicleModel.getVehicle(data.id_vehicle, (resultVehicle) => {
        if (resultVehicle.length === 0) {
          return res.status(400).json({
            success: false,
            error: 'Kendaraan tidak ditemukan',
          });
        }
        data.id_user = parseInt(data.id_user, 10);
        data.id_vehicle = parseInt(data.id_vehicle, 10);
        if (data.has_returned) {
          data.has_returned = parseInt(data.has_returned, 10);
        }
        if (data.prepayment) {
          data.prepayment = parseFloat(data.prepayment, 10);
        }
        historyModel.addHistory(data, (result) => res.json({
          success: true,
          message: `${result.affectedRows} history added`,
          data,
        }));
      });
    }).catch((errMsg) => res.status(400).json({
      success: false,
      error: errMsg,
    }));
  }).catch((errMsg) => res.status(400).json({
    success: false,
    error: errMsg,
  }));
};

const editHistory = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const error = validateDataHistory(data);
  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  cekUser(data).then(() => {
    cekVehicle(data).then(() => {
      vehicleModel.getVehicle(data.id_vehicle, (resultVehicle) => {
        if (resultVehicle.length === 0) {
          return res.status(400).json({
            success: false,
            error: 'Kendaraan tidak ditemukan',
          });
        }
        historyModel.getHistory(id, (results) => {
          if (results.length > 0) {
            data.id_history = parseInt(id, 10);
            data.id_user = parseInt(data.id_user, 10);
            data.id_vehicle = parseInt(data.id_vehicle, 10);
            if (data.has_returned) {
              data.has_returned = parseInt(data.has_returned, 10);
            }
            if (data.prepayment) {
              data.prepayment = parseFloat(data.prepayment, 10);
            }
            historyModel.editHistory(id, data, () => res.json({
              success: true,
              message: `History with id ${id} has been updated`,
              data,
            }));
          } else {
            return res.status(404).json({
              success: false,
              message: 'History not found',
            });
          }
        });
      });
    }).catch((errMsg) => res.status(400).json({
      success: false,
      error: errMsg,
    }));
  }).catch((errMsg) => res.status(400).json({
    success: false,
    error: errMsg,
  }));
};

const deleteHistory = (req, res) => {
  const { id } = req.params;

  historyModel.getHistory(id, (results) => {
    if (results.length > 0) {
      historyModel.deleteHistory(id, () => res.json({
        success: true,
        message: `History with id ${id} has been deleted`,
        data: results[0],
      }));
    } else {
      return res.status(404).json({
        success: false,
        message: 'History not found',
      });
    }
  });
};

module.exports = {
  getHistories,
  getHistory,
  addHistory,
  editHistory,
  deleteHistory,
};
