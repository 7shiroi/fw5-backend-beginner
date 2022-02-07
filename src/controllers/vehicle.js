/* eslint-disable consistent-return */
const vehicleModel = require('../models/vehicle');
const categoryModel = require('../models/category');

const checkIntegerFormat = (data) => /^[1-9][0-9]*/.test(data); // check apakah data isinya hanya digit yang awalnya bukan 0
const checkPriceFormat = (data) => /^[^-0+]\d+.\d{2}?$/.test(data) || /^0$/.test(data);
const checkBoolean = (data) => /^[01]$/.test(data);
const timeValidation = (data) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data);

const filterQueryValidation = (data) => {
  const error = [];
  if (!['color', 'price', 'capacity', 'stock', 'category', 'name'].includes(data.sort.toLowerCase())) {
    error.push('Sort query invalid!');
  }
  if (!['asc', 'desc'].includes(data.order.toLowerCase())) {
    error.push('Order query invalid!');
  }
  if (data.isAvailable.length > 0 && ![0, 1].includes(parseInt(data.isAvailable, 10))) {
    error.push('Availability filter query invalid!');
  }
  if (data.hasPrepayment.length > 0 && ![0, 1].includes(parseInt(data.hasPrepayment, 10))) {
    error.push('Prepayment filter query invalid!');
  }

  if (data.page !== undefined && !checkIntegerFormat(data.page)) {
    error.push('Page query invalid!');
  }
  if (data.limit !== undefined && !checkIntegerFormat(data.limit)) {
    error.push('Limit query invalid!');
  }
  return error;
};

const getVehicles = (req, res) => {
  let {
    search, sort, order, page, limit, isAvailable, hasPrepayment,
  } = req.query;

  sort = sort || 'name';
  order = order || 'asc';
  isAvailable = isAvailable || '';
  hasPrepayment = hasPrepayment || '';

  const dataQuery = {
    search, sort, order, page, limit, isAvailable, hasPrepayment,
  };
  const error = filterQueryValidation(dataQuery);

  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  search = search || '';
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 5;

  const offset = (page - 1) * limit;
  const data = {
    search, sort, order, isAvailable, hasPrepayment, offset, limit,
  };
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
              prev: page > 1 ? `http://localhost:5000/vehicle?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page - 1}&limit=${limit}` : null,
              next: page < lastPage ? `http://localhost:5000/vehicle?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}` : null,
              totalData: rowsCount,
              currentPage: page,
              lastPage,
            },
            results,
          });
        }
        return res.status(400).json({
          success: false,
          message: 'List not found',
        });
      });
    } else {
      return res.status(400).json({
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
  let {
    search, sort, order, page, limit, isAvailable, hasPrepayment,
  } = req.query;

  sort = sort || 'name';
  order = order || 'asc';
  isAvailable = isAvailable || '';
  hasPrepayment = hasPrepayment || '';

  const dataQuery = {
    search, sort, order, page, limit, isAvailable, hasPrepayment,
  };
  const error = filterQueryValidation(dataQuery);

  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  search = search || '';
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 5;

  if (page < 1) {
    page = 1;
  }
  if (limit < 1) {
    limit = 5;
  }

  const offset = (page - 1) * limit;
  const data = {
    search, sort, order, isAvailable, hasPrepayment, offset, limit,
  };
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
              prev: page > 1 ? `http://localhost:5000/vehicle?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page - 1}&limit=${limit}` : null,
              next: page < lastPage ? `http://localhost:5000/vehicle?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}` : null,
              totalData: rowsCount,
              currentPage: page,
              lastPage,
            },
            results,
          });
        }
        return res.status(400).json({
          success: false,
          message: 'List not found',
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'List not found',
      });
    }
  });
};

const getVehiclesFromCategory = (req, res) => {
  let { page, limit } = req.query;
  // eslint-disable-next-line camelcase
  const { id } = req.params;
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 5;
  const offset = (page - 1) * limit;
  // eslint-disable-next-line camelcase
  const data = { offset, limit };
  data.id_category = id;
  vehicleModel.getVehiclesFromCategoryCount(data, (count) => {
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      vehicleModel.getVehiclesFromCategory(data, (results) => {
        if (results.length > 0) {
          return res.json({
            success: true,
            message: 'List Vehicles',
            pageInfo: {
              prev: page > 1 ? `http://localhost:5000/vehicle/category/${data.id_category}?page=${page - 1}&limit=${limit}` : null,
              next: page < lastPage ? `http://localhost:5000/vehicle/category/${data.id_category}?page=${page + 1}&limit=${limit}` : null,
              totalData: rowsCount,
              currentPage: page,
              lastPage,
            },
            results,
          });
        }
        return res.status(400).json({
          success: false,
          message: 'List not found',
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'List not found',
      });
    }
  });
};

const cekCategory = (categoryId) => new Promise((resolve, reject) => {
  categoryModel.getCategory(categoryId, (res) => {
    if (res.length > 0) {
      resolve();
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('Kategori tidak ditemukan');
    }
  });
});

// eslint-disable-next-line require-jsdoc
function validateDataVehicle(data) {
  // expected data {name, id_category, color, location, stock, price, capacity, is_available(0,1),
  // has_prepayment(0,1), reservation_deadline check string format (00.00)}
  const error = [];

  if (data.name === undefined || data.name.length === 0) {
    error.push('Input parameter nama salah!');
  } else if (data.name.length > 100) {
    error.push('Input nama terlalu panjang!');
  }
  if (data.id_category === undefined || !checkIntegerFormat(data.id_category)) {
    error.push('Input parameter kategori salah!');
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
    || !checkIntegerFormat(data.stock)
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
    data.capacity === undefined
    || !checkIntegerFormat(data.capacity)
  ) {
    error.push('Input parameter capacity salah!');
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

  cekCategory(data.id_category).then(() => {
    vehicleModel.checkVehicle(data, (result) => {
      if (result[0].checkCount > 0) {
        return res.status(400).json({
          success: false,
          error: 'Data sudah ada!',
        });
      }
      data.id_category = parseInt(data.id_category, 10);
      data.stock = parseInt(data.stock, 10);
      data.price = parseFloat(data.price, 10);
      data.is_available = parseInt(data.is_available, 10);
      data.has_prepayment = parseInt(data.has_prepayment, 10);
      vehicleModel.addVehicle(data, (results) => res.json({
        success: true,
        message: `${results.affectedRows} vehicle added`,
        results: data,
      }));
    });
  }).catch((errMsg) => res.status(400).json({
    success: false,
    error: errMsg,
  }));
};

const editVehicle = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  data.id = parseInt(id, 10);
  //   expected body {name, type, merk, stock, price}
  const error = validateDataVehicle(data);
  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  cekCategory(data.id_category).then(() => {
    vehicleModel.checkVehicle(data, (result) => {
      if (result[0].checkCount > 0) {
        return res.status(400).json({
          success: false,
          error: 'Data sudah ada!',
        });
      }

      vehicleModel.getVehicle(id, (results) => {
        if (results.length > 0) {
          data.id_category = parseInt(data.id_category, 10);
          data.stock = parseInt(data.stock, 10);
          data.price = parseFloat(data.price, 10);
          data.is_available = parseInt(data.is_available, 10);
          data.has_prepayment = parseInt(data.has_prepayment, 10);
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
  }).catch((errMsg) => res.status(400).json({
    success: false,
    error: errMsg,
  }));
};

const deleteVehicle = (req, res) => {
  const { id } = req.params;

  vehicleModel.getVehicle(id, (results) => {
    if (results.length > 0) {
      vehicleModel.deleteVehicle(id, () => res.json({
        succes: true,
        message: `Vehicle with id ${id} has been deleted`,
        data: results,
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
  getVehiclesFromCategory,
};
