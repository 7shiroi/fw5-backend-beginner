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

const checkStockFormat = (data) => /^[1-9][0-9]*/.test(data); // check apakah data isinya hanya digit yang awalnya bukan 0
const checkPriceFormat = (data) => /^[^-0+]\d+.\d{2}?$/.test(data) || /^0$/.test(data);
const checkBoolean = (data) => /^[01]$/.test(data);
const timeValidation = (data) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data);

// eslint-disable-next-line require-jsdoc
function validateDataVehicle(data) {
  // expected data {name, color, location, stock, price, capacity, is_available(0,1),
  // has_repayment(0,1), reservation_deadline check string format (00.00)}
  const error = [];

  if (data.name === undefined || data.name.length === 0) {
    error.push('Input parameter nama salah!');
  }
  if (data.name === undefined || data.name.length > 100) {
    error.push('Input nama terlalu panjang!');
  }
  if (data.category === undefined || data.category.length === 0) {
    error.push('Input parameter kategori salah!');
  } else if (data.category.length > 30) {
    error.push('Input kategori terlalu panjang!');
  }
  if (data.color === undefined || data.color.length === 0) {
    error.push('Input parameter warna salah!');
  } else if (data.color.length > 30) {
    error.push('Input warna terlalu panjang!');
  }
  if (data.location === undefined || data.location.length === 0) {
    error.push('Input parameter lokasi salah!');
  } else if (data.location.length > 100) {
    error.push('Input lokasi terlalu panjang!');
  }
  if (
    data.stock === undefined
    || !checkStockFormat(data.stock)
  ) {
    error.push('Input parameter stock salah!');
  }
  if (
    data.price === undefined
    || !checkPriceFormat(data.price)
  ) {
    error.push('Input parameter harga salah!');
  }
  if (
    data.is_available !== undefined
    && !checkBoolean(data.is_available)
  ) {
    error.push('Input parameter is_available salah!');
  }
  if (
    data.has_prepayment !== undefined
    && !checkBoolean(data.has_prepayment)
  ) {
    error.push('Input parameter has_prepayment salah!');
  }
  if (
    data.reservation_deadline !== undefined
    && !timeValidation(data.reservation_deadline)
  ) {
    error.push('Input parameter reservation_deadline salah!');
  }
  return error;
}

const addVehicle = (req, res) => {
  const data = req.body;
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
    return res.status(400).json({
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
