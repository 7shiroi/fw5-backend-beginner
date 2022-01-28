/* eslint-disable consistent-return */
const vehicleModel = require('../models/vehicle');

const getVehicles = (req, res) => {
  vehicleModel.getVehicles((results) => res.json({
    success: true,
    message: 'List Vehicles',
    results,
  }));
};

const getVehicle = (req, res) => {
  const { id } = req.params;
  vehicleModel.getVehicle(id, (results) => {
    if (results.length > 0) {
      return res.json({
        success: true,
        message: 'Detail Vehicle',
        results: results[0],
      });
    }
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found',
    });
  });
};

// eslint-disable-next-line require-jsdoc
function validateDataVehicle(data) {
  // expected data {name, color, location, stock, price, capacity, is_available(0,1),
  // has_repayment(0,1), reservation_deadline check string format (00.00)}
  const error = [];

  if (data.name === undefined || data.name.length === 0) {
    error.push('Input parameter nama salah!');
  }
  if (data.color === undefined || data.color.length === 0) {
    error.push('Input parameter warna salah!');
  }
  if (data.location === undefined || data.location.length === 0) {
    error.push('Input parameter lokasi salah!');
  }
  if (
    data.stock === undefined
    || typeof parseInt(data.stock, 10) !== 'number'
    || data.stock.length === 0
  ) {
    error.push('Input parameter stock salah!');
  }
  if (
    data.price === undefined
    || typeof parseFloat(data.price) !== 'number'
    || data.price.length === 0
  ) {
    error.push('Input parameter harga salah!');
  }
  if (
    data.price === undefined
    || typeof parseFloat(data.price) !== 'number'
    || data.price.length === 0
  ) {
    error.push('Input parameter harga salah!');
  }
  if (
    data.is_available !== undefined
    && (parseInt(data.is_available, 10) < 0
    && parseInt(data.is_available, 10) > 1)
  ) {
    error.push('Input parameter is_available salah!');
  }
  if (
    data.has_prepayment !== undefined
    && parseInt(data.has_prepayment, 10) < 0
    && parseInt(data.has_prepayment, 10) > 1
  ) {
    error.push('Input parameter has_prepayment salah!');
  }
  // todo: validate reservation deadline
  return error;
}

const addVehicle = (req, res) => {
  const data = req.body;
  //   expected body {name, type, merk, stock, price}
  const error = validateDataVehicle(data);
  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  vehicleModel.addVehicle(data, (result) => res.json({
    success: true,
    message: `${result.affectedRows} vehicle added`,
  }));
};

const editVehicle = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  //   expected body {name, type, merk, stock, price}
  const error = validateDataVehicle(data);
  if (error.length > 0) {
    return res.json({
      success: false,
      error,
    });
  }

  vehicleModel.getVehicle(id, (results) => {
    if (results.length > 0) {
      vehicleModel.editVehicle(id, data, (result) => res.json({
        success: true,
        sql_res: `Affected rows: ${result.affectedRows}`,
        message: `Vehicle with id ${id} has been updated`,
      }));
    } else {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
  });
};

const deleteVehicle = (req, res) => {
  const { id } = req.params;

  vehicleModel.getVehicle(id, (results) => {
    if (results.length > 0) {
      vehicleModel.deleteVehicle(id, (result) => res.json({
        succes: true,
        sql_res: `Affected rows: ${result.affectedRows}`,
        message: `Vehicle with id ${id} has been deleted`,
      }));
    } else {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
  });
};

module.exports = {
  getVehicles,
  getVehicle,
  addVehicle,
  editVehicle,
  deleteVehicle,
};
