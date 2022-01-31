/* eslint-disable consistent-return */
const vehicleModel = require('../models/vehicle');

const getVehicles = (req, res) => {
  let { search, page, limit } = req.query;
  search = search || '';
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 5;
  const offset = (page - 1) * limit;
  const data = { search, offset, limit };
  vehicleModel.getVehicleCount(data, (count) => {
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      vehicleModel.getVehicles(data, (results) => {
        if (results.length > 0) {
          return res.json({
            success: true,
            message: 'List Vehicles',
            pageInfo: {
              prev: page > 1 ? `http://localhost:5000/vehicles?search=${search}&page=${page - 1}&limit=${limit}` : null,
              next: page < lastPage ? `http://localhost:5000/vehicles?search=${search}&page=${page + 1}&limit=${limit}` : null,
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

const getPopularVehicles = (req, res) => {
  let { search, page, limit } = req.query;
  search = search || '';
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 5;
  const offset = (page - 1) * limit;
  const data = { search, offset, limit };
  vehicleModel.getPopularVehiclesCount(data, (count) => {
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      vehicleModel.getPopularVehicles(data, (results) => {
        if (results.length > 0) {
          return res.json({
            success: true,
            message: 'List Vehicles',
            pageInfo: {
              prev: page > 1 ? `http://localhost:5000/vehicles?search=${search}&page=${page - 1}&limit=${limit}` : null,
              next: page < lastPage ? `http://localhost:5000/vehicles?search=${search}&page=${page + 1}&limit=${limit}` : null,
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

  vehicleModel.checkVehicle(data, (result) => {
    if (result[0].checkCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Data sudah ada!',
      });
    }

    data.stock = parseInt(data.stock, 10);
    data.price = parseFloat(data.price, 10);
    data.is_available = parseInt(data.stock, 10);
    data.has_prepayment = parseInt(data.stock, 10);
    vehicleModel.addVehicle(data, (results) => res.json({
      success: true,
      message: `${results.affectedRows} vehicle added`,
      results: data,
    }));
  });
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

  vehicleModel.checkVehicle(data, (result) => {
    if (result[0].checkCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Data sudah ada!',
      });
    }

    vehicleModel.getVehicle(id, (results) => {
      if (results.length > 0) {
        data.stock = parseInt(data.stock, 10);
        data.price = parseFloat(data.price, 10);
        data.is_available = parseInt(data.stock, 10);
        data.has_prepayment = parseInt(data.stock, 10);
        vehicleModel.editVehicle(id, data, () => res.json({
          success: true,
          message: `Vehicle with id ${id} has been updated`,
          results: data,
        }));
      } else {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found',
        });
      }
    });
  });
};

const deleteVehicle = (req, res) => {
  const { id } = req.params;

  vehicleModel.getVehicle(id, (results) => {
    if (results.length > 0) {
      vehicleModel.deleteVehicle(id, () => res.json({
        succes: true,
        message: `Vehicle with id ${id} has been deleted`,
        results,
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
  getPopularVehicles,
};
