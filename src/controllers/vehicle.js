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
  // expected data {name, type, merk, stock, price}
  const error = [];

  if (data.name === undefined || data.name.length === 0) {
    error.push('Input parameter nama salah!');
  }
  if (data.type === undefined || data.type.length === 0) {
    error.push('Input parameter type salah!');
  }
  if (data.merk === undefined || data.merk.length === 0) {
    error.push('Input parameter merk salah!');
  }
  if (
    data.stock === undefined
    || data.stock.length === 0
    || typeof parseInt(data.stock, 10) !== 'number'
  ) {
    error.push('Input parameter stock salah!');
  }
  if (
    data.price === undefined
    || data.price.length === 0
    || typeof parseFloat(data.price) !== 'number'
  ) {
    error.push('Input parameter price salah!');
  }
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
