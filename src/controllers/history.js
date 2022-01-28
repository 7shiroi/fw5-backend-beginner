/* eslint-disable consistent-return */
const historyModel = require('../models/history');
const userModel = require('../models/user');
const vehicleModel = require('../models/vehicle');

const getHistories = (req, res) => {
  historyModel.getHistories((results) => res.json({
    success: true,
    message: 'List Histories',
    results,
  }));
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

// eslint-disable-next-line require-jsdoc
function validateDataHistory(data) {
  // expected data {id_user (fk), id_vehicle (fk), date_start, date_end,
  // has_returned, prepayment (nullable)}
  const error = [];

  if (data.id_user === undefined || parseInt(data.id_user, 10) <= 0) {
    error.push('Input parameter id_user salah!');
  }
  // else {
  //   userModel.getUser(data.id_user, (res) => {
  //     if (res.length === 0) {
  //       error.push('User tidak ditemukan');
  //     }
  //   });
  // }
  if (data.id_vehicle === undefined || parseInt(data.id_vehicle, 10) <= 0) {
    error.push('Input parameter id_vehicle salah!');
  }
  // else {
  //   vehicleModel.getVehicle(data.id_vehicle, (res) => {
  //     if (res.length === 0) {
  //       error.push('Kendaraan tidak ditemukan');
  //     }
  //   });
  // }
  // todo add validation for date
  if (data.date_start === undefined || data.date_start.length === 0) {
    error.push('Input parameter date_start salah!');
    if (data.date_end === undefined || data.date_end.length === 0) {
      error.push('Input parameter date_end salah!');
    } else {
      // todo cek date_start < date_end
    }
  }
  if (
    data.has_returned !== undefined
    && (parseInt(data.has_returned, 10) < 0 || parseInt(data.has_returned, 10) > 1)
  ) {
    error.push('Input parameter has_returned salah!');
  }
  // todo validation for prepayment maybe?

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

  userModel.getUser(data.id_user, (resultUser) => {
    if (resultUser.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'user tidak ditemukan',
      });
    }
    vehicleModel.getVehicle(data.id_vehicle, (resultVehicle) => {
      if (resultVehicle.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Kendaraan tidak ditemukan',
        });
      }
      historyModel.addHistory(data, (result) => res.json({
        success: true,
        message: `${result.affectedRows} history added`,
      }));
    });
  });
};

const editHistory = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const error = validateDataHistory(data);
  if (error.length > 0) {
    return res.json({
      success: false,
      error,
    });
  }

  userModel.getUser(data.id_user, (resultUser) => {
    if (resultUser.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'user tidak ditemukan',
      });
    }
    vehicleModel.getVehicle(data.id_vehicle, (resultVehicle) => {
      if (resultVehicle.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Kendaraan tidak ditemukan',
        });
      }
      historyModel.getHistory(id, (results) => {
        if (results.length > 0) {
          historyModel.editHistory(id, data, (result) => res.json({
            success: true,
            sql_res: `Affected rows: ${result.affectedRows}`,
            message: `History with id ${id} has been updated`,
          }));
        } else {
          return res.status(404).json({
            success: false,
            message: 'History not found',
          });
        }
      });
    });
  });
};

const deleteHistory = (req, res) => {
  const { id } = req.params;

  historyModel.getHistory(id, (results) => {
    if (results.length > 0) {
      historyModel.deleteHistory(id, (result) => res.json({
        succes: true,
        sql_res: `Affected rows: ${result.affectedRows}`,
        message: `History with id ${id} has been deleted`,
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
