/* eslint-disable consistent-return */
const vehicleModel = require('../models/vehicle');
const categoryModel = require('../models/category');
const {
  checkIntegerFormat,
  checkPriceFormat,
  checkBoolean,
  timeValidation,
  idValidator,
  varcharValidator,
} = require('../helpers/validator');
const responseHandler = require('../helpers/responseHandler');
const { deleteFile } = require('../helpers/fileHandler');

const { APP_URL } = process.env;

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

const getVehicles = async (req, res) => {
  try {
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
      return responseHandler(res, 400, null, null, error);
    }

    search = search || '';
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;

    const offset = (page - 1) * limit;
    const data = {
      search, sort, order, isAvailable, hasPrepayment, offset, limit,
    };
    const vehicleCount = await vehicleModel.getVehicleCountAsync(data);
    const { rowsCount } = vehicleCount[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await vehicleModel.getVehiclesAsync(data);
      if (results.length > 0) {
        const pageInfo = {
          prev: page > 1 ? `http://localhost:5000/vehicle?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `http://localhost:5000/vehicle?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        const mapResults = results.map((o) => {
          if (o.image !== null) {
            // eslint-disable-next-line no-param-reassign
            o.image = `${APP_URL}/${o.image}`;
          }
          return o;
        });
        return responseHandler(res, 200, 'List Vehicles', mapResults, null, pageInfo);
      }
      return responseHandler(res, 400, 'List not found', results);
    }
    return responseHandler(res, 400, 'List not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const getVehicle = async (req, res) => {
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    const { id } = req.params;
    const results = await vehicleModel.getVehicleAsync(id);
    if (results.length > 0) {
      const mapResults = results.map((o) => {
        if (o.image !== null) {
          // eslint-disable-next-line no-param-reassign
          o.image = `${APP_URL}/${o.image}`;
        }
        return o;
      });
      return responseHandler(res, 200, 'Detail Vehicle', mapResults[0]);
    }
    return responseHandler(res, 404, 'Vehicle not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const getPopularVehicles = async (req, res) => {
  try {
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
      return responseHandler(res, 400, null, null, error);
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

    const count = await vehicleModel.getPopularVehiclesCountAsync(data);
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await vehicleModel.getPopularVehiclesAsync(data);
      if (results.length > 0) {
        const pageInfo = {
          prev: page > 1 ? `http://localhost:5000/vehicle?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `http://localhost:5000/vehicle?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        const mapResults = results.map((o) => {
          if (o.image !== null) {
          // eslint-disable-next-line no-param-reassign
            o.image = `${APP_URL}/${o.image}`;
          }
          return o;
        });
        return responseHandler(res, 200, 'List Popular Vehicles', mapResults, null, pageInfo);
      }
      return responseHandler(res, 400, 'List not found', results);
    }
    return responseHandler(res, 400, 'List not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const getVehiclesFromCategory = async (req, res) => {
  try {
    let { page, limit } = req.query;
    // eslint-disable-next-line camelcase
    const { id } = req.params;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;
    const offset = (page - 1) * limit;
    // eslint-disable-next-line camelcase
    const data = { offset, limit };
    data.id_category = id;
    const count = await vehicleModel.getVehiclesFromCategoryCountAsync(data);
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await vehicleModel.getVehiclesFromCategoryAsync(data);
      if (results.length > 0) {
        const pageInfo = {
          prev: page > 1 ? `http://localhost:5000/vehicle/category/${data.id_category}?page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `http://localhost:5000/vehicle/category/${data.id_category}?page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        const mapResults = results.map((o) => {
          if (o.image !== null) {
          // eslint-disable-next-line no-param-reassign
            o.image = `${APP_URL}/${o.image}`;
          }
          return o;
        });
        return responseHandler(res, 200, 'List Vehicles grouped by category', mapResults, null, pageInfo);
      }
      return responseHandler(res, 400, 'List not found', results);
    }
    return responseHandler(res, 400, 'List not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

// eslint-disable-next-line require-jsdoc
function validateDataVehicle(data) {
  // expected data {name, id_category, color, location, stock, price, capacity, is_available(0,1),
  // has_prepayment(0,1), reservation_deadline check string format (00.00), image (nullable)}
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

const addVehicle = async (req, res) => {
  try {
    if (!req.user || req.user.role > 2) {
      return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
    }
    const data = req.body;
    const error = validateDataVehicle(data);
    // const vehicleCategoryCheck = await vehicleCategoryValidation(req.body.id_category);

    if (error.length > 0) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 400, null, null, error);
    }
    if (req.file) {
      data.image = req.file.path;
    }

    const categoryCheck = await categoryModel.getCategoryAsync(data.id_category);
    if (categoryCheck.length > 0) {
      const vehicleCheck = await vehicleModel.checkVehicleAsync(data);
      if (vehicleCheck[0].checkCount > 0) {
        if (req.file) {
          try {
            deleteFile(req.file.path);
          } catch (err) {
            return responseHandler(res, 500, null, null, err.message);
          }
        }
        return responseHandler(res, 400, null, null, 'Vehicle already existed');
      }
      const addVehicleData = await vehicleModel.addVehicleAsync(data);
      const insertedData = await vehicleModel.getVehicleAsync(addVehicleData.insertId);
      const mapResults = insertedData.map((o) => {
        if (o.image !== null) {
          // eslint-disable-next-line no-param-reassign
          o.image = `${APP_URL}/${o.image}`;
        }
        return o;
      });
      return responseHandler(res, 201, `${addVehicleData.affectedRows} vehicle added`, mapResults);
    }
    if (req.file) {
      try {
        deleteFile(req.file.path);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 400, null, null, `Category with id ${data.id_category} not found`);
  } catch (error) {
    if (req.file) {
      try {
        deleteFile(req.file.path);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 500, null, null, error);
  }
};

const editVehicle = async (req, res) => {
  try {
    if (!req.user || req.user.role > 2) {
      return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
    }
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    const { id } = req.params;

    const getVehicleData = await vehicleModel.getVehicleAsync(id);
    if (getVehicleData.results === 0) {
      return responseHandler(res, 400, null, null, 'Vehicle not found');
    }

    const fillable = [
      {
        field: 'name', required: false, type: 'varchar', max_length: 100,
      },
      {
        field: 'id_category', required: false, type: 'integer',
      },
      {
        field: 'color', required: false, type: 'varchar', max_length: 30,
      },
      {
        field: 'location', required: false, type: 'varchar', max_length: 100,
      },
      {
        field: 'stock', required: false, type: 'integer',
      },
      {
        field: 'price', required: false, type: 'integer',
      },
      {
        field: 'capacity', required: false, type: 'integer',
      },
      {
        field: 'image', required: false, type: 'text',
      },
      {
        field: 'is_available', required: false, type: 'boolean',
      },
      {
        field: 'has_prepayment', required: false, type: 'boolean',
      },
      {
        field: 'reservation_deadline', required: false, type: 'time',
      },
    ];

    const error = [];
    const data = {};
    fillable.forEach((input) => {
      if (!req.body[input.field] && input.required) {
        error.push(`${input.field} cannot be empty`);
      } else if (req.body[input.field]) {
        if (input.type === 'integer' && !checkIntegerFormat(req.body[input.field])) {
          error.push(`Invalid ${input.field} format`);
        }
        if (input.type === 'varchar' && !varcharValidator(req.body[input.field].trim(), input.max_length)) {
          error.push(`Invalid ${input.field} format`);
        }
        if (input.type === 'boolean' && !checkBoolean(req.body[input.field])) {
          error.push(`Invalid ${input.field} format`);
        }
        if (input.type === 'time' && !timeValidation(req.body[input.field])) {
          error.push(`Invalid ${input.field} format`);
        }
        if (input.type === 'text' && req.body[input.field].trim().length === 0) {
          error.push(`Invalid ${input.field} format`);
        }
        data[input.field] = req.body[input.field];
      }
    });

    data.id = parseInt(id, 10);
    if (error.length > 0) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 500, null, null, error);
    }
    if (req.file) {
      data.image = req.file.path;
    }

    if (data.id_category) {
      const categoryCheck = await categoryModel.getCategoryAsync(data.id_category);
      if (categoryCheck.length === 0) {
        return responseHandler(res, 400, null, null, `Cannot find category with id ${data.id_category}`);
      }
    }
    const vehicleCheck = await vehicleModel.checkVehicleAsync(data);
    if (vehicleCheck[0].checkCount > 0) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (err) {
          return responseHandler(res, 500, null, null, 'Unexpected Error');
        }
      }
      return responseHandler(res, 400, null, null, 'New data is duplicate of existing data');
    }
    if (data.image && getVehicleData[0].image) {
      try {
        deleteFile(getVehicleData[0].image);
      } catch (err) {
        return responseHandler(res, 500, null, null, 'Unexpected error');
      }
    }
    const updateVehicleData = await vehicleModel.editVehicleAsync(id, data);
    if (updateVehicleData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }
    const updatedData = await vehicleModel.getVehicleAsync(id);
    const mapResults = updatedData.map((o) => {
      if (o.image !== null) {
        // eslint-disable-next-line no-param-reassign
        o.image = `${APP_URL}/${o.image}`;
      }
      return o;
    });
    return responseHandler(res, 200, `Vehicle with id ${id} has been updated`, mapResults[0]);
  } catch (error) {
    if (req.file) {
      try {
        deleteFile(req.file.path);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 500, null, null, error);
  }
};
const deleteVehicle = async (req, res) => {
  try {
    if (!req.user || req.user.role > 2) {
      return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
    }
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    const { id } = req.params;

    const results = await vehicleModel.getVehicleAsync(id);
    if (results.length === 0) {
      return responseHandler(res, 400, null, null, 'Vehicle not found');
    }

    if (results[0].image) {
      try {
        deleteFile(results[0].image);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    const deleteVehicleData = await vehicleModel.deleteVehicleAsync(id);
    if (deleteVehicleData.affectedRows > 0) {
      return responseHandler(res, 200, `Vehicle with id ${id} has been deleted`, results);
    }
  } catch (error) {
    return responseHandler(res, 500, null, null, error);
  }
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
