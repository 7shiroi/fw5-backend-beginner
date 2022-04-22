/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
const vehicleModel = require('../models/vehicle');
const categoryModel = require('../models/category');
const {
  checkIntegerFormat,
  idValidator,
  inputValidator,
} = require('../helpers/validator');
const responseHandler = require('../helpers/responseHandler');
const { deleteFile } = require('../helpers/fileHandler');
const { cloudPathToFileName } = require('../helpers/converter');

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
  if (data.idCategory.length > 0 && !checkIntegerFormat(data.idCategory)) {
    error.push('IdCategory query invalid');
  }
  if (data.minPrice.length > 0 && (data.minPrice < 0 || isNaN(data.maxPrice))) {
    error.push('Minimum price cannot be lower than 0');
  }
  if (data.maxPrice.length > 0 && (data.maxPrice < 0 || isNaN(data.maxPrice))) {
    error.push('Maximum price cannot be lower than 0');
  }
  if (data.minPrice && data.maxPrice && data.maxPrice < data.minPrice) {
    error.push('Maximum price cannot be lower minPrice');
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
      search,
      sort,
      order,
      page,
      limit,
      isAvailable,
      hasPrepayment,
      idCategory,
      minPrice,
      maxPrice,
      location,
    } = req.query;

    sort = sort || 'name';
    order = order || 'asc';
    isAvailable = isAvailable || '';
    hasPrepayment = hasPrepayment || '';
    idCategory = idCategory || '';
    minPrice = parseInt(minPrice, 10);
    maxPrice = parseInt(maxPrice, 10);
    location = location || '';

    const dataQuery = {
      search,
      sort,
      order,
      page,
      limit,
      isAvailable,
      hasPrepayment,
      idCategory,
      minPrice,
      maxPrice,
      location,
    };
    const error = filterQueryValidation(dataQuery);

    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }

    if (idCategory.length > 0) {
      const categoryCheck = await categoryModel.getCategoryAsync(idCategory);
      if (categoryCheck.length === 0) {
        return responseHandler(res, 400, null, null, `Category with id ${idCategory} not found`);
      }
    }

    search = search || '';
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;

    const offset = (page - 1) * limit;
    const data = {
      search,
      sort,
      order,
      isAvailable,
      hasPrepayment,
      offset,
      limit,
      idCategory,
      minPrice,
      maxPrice,
      location,
    };
    const vehicleCount = await vehicleModel.getVehicleCountAsync(data);
    const { rowsCount } = vehicleCount[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await vehicleModel.getVehiclesAsync(data);
      if (results.length > 0) {
        const pageInfo = {
          prev: page > 1 ? `${APP_URL}/vehicle?search=${search}&idCategory=${idCategory}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&minPrice=${minPrice}&maxPrice=${maxPrice}&location=${location}&sort=${sort}&order=${order}&page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `${APP_URL}/vehicle?search=${search}&idCategory=${idCategory}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&minPrice=${minPrice}&maxPrice=${maxPrice}&location=${location}&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        return responseHandler(res, 200, 'List Vehicles', results, null, pageInfo);
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
      return responseHandler(res, 200, 'Detail Vehicle', results[0]);
    }
    return responseHandler(res, 404, 'Vehicle not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const getPopularVehicles = async (req, res) => {
  try {
    let {
      search, sort, order, page, limit, isAvailable, hasPrepayment, minPrice, maxPrice, location,
    } = req.query;

    sort = sort || 'name';
    order = order || 'asc';
    isAvailable = isAvailable || '';
    hasPrepayment = hasPrepayment || '';
    const idCategory = '';

    minPrice = parseInt(minPrice, 10);
    maxPrice = parseInt(maxPrice, 10);
    location = location || '';
    const dataQuery = {
      search,
      sort,
      order,
      page,
      limit,
      isAvailable,
      hasPrepayment,
      idCategory,
      minPrice,
      maxPrice,
      location,
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
      search, sort, order, isAvailable, hasPrepayment, offset, limit, minPrice, maxPrice, location,
    };

    const count = await vehicleModel.getPopularVehiclesCountAsync(data);
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await vehicleModel.getPopularVehiclesAsync(data);
      if (results.length > 0) {
        const pageInfo = {
          prev: page > 1 ? `${APP_URL}/vehicle/popular?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&minPrice=${minPrice}&maxPrice=${maxPrice}&location=${location}&sort=${sort}&order=${order}&page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `${APP_URL}/vehicle/popular?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&minPrice=${minPrice}&maxPrice=${maxPrice}&location=${location}&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        return responseHandler(res, 200, 'List Popular Vehicles', results, null, pageInfo);
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
    let {
      search, sort, order, page, limit, isAvailable, hasPrepayment,
    } = req.query;

    sort = sort || 'name';
    order = order || 'asc';
    isAvailable = isAvailable || '';
    hasPrepayment = hasPrepayment || '';
    const idCategory = '';
    const dataQuery = {
      search, sort, order, page, limit, isAvailable, hasPrepayment, idCategory,
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
    };// eslint-disable-next-line camelcase
    const { id } = req.params;
    const count = await vehicleModel.getVehiclesFromCategoryCountAsync(data, id);
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await vehicleModel.getVehiclesFromCategoryAsync(data, id);
      if (results.length > 0) {
        const pageInfo = {
          prev: page > 1 ? `${APP_URL}/vehicle/category/${id}?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `${APP_URL}/vehicle/category/${id}?search=${search}&isAvailable=${isAvailable}&hasPrepayment=${hasPrepayment}&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        return responseHandler(res, 200, 'List Vehicles grouped by category', results, null, pageInfo);
      }
      return responseHandler(res, 400, 'List not found', results);
    }
    return responseHandler(res, 400, 'List not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const addVehicle = async (req, res) => {
  try {
    if (!req.user || req.user.role > 2) {
      return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
    }

    const fillable = [
      {
        field: 'name', required: true, type: 'varchar', max_length: 100,
      },
      {
        field: 'id_category', required: true, type: 'integer',
      },
      {
        field: 'color', required: true, type: 'varchar', max_length: 30,
      },
      {
        field: 'location', required: true, type: 'varchar', max_length: 100,
      },
      {
        field: 'stock', required: true, type: 'integer', can_zero: true,
      },
      {
        field: 'price', required: true, type: 'price',
      },
      {
        field: 'capacity', required: true, type: 'integer',
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

    const { error, data } = inputValidator(req, fillable);

    if (error.length > 0) {
      if (req.file) {
        try {
          deleteFile(req.file.filename);
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
    if (categoryCheck.length === 0) {
      if (req.file) {
        try {
          deleteFile(req.file.filename);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 400, null, null, `Category with id ${data.id_category} not found`);
    }

    const vehicleCheck = await vehicleModel.checkVehicleAsync(data);
    if (vehicleCheck[0].checkCount > 0) {
      if (req.file) {
        try {
          deleteFile(req.file.filename);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 400, null, null, 'Vehicle already existed');
    }

    const addVehicleData = await vehicleModel.addVehicleAsync(data);
    const insertedData = await vehicleModel.getVehicleAsync(addVehicleData.insertId);
    return responseHandler(res, 201, `${addVehicleData.affectedRows} vehicle added`, insertedData[0]);
  } catch (error) {
    if (req.file) {
      try {
        deleteFile(req.file.filename);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
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
        field: 'stock', required: false, type: 'integer', can_zero: true,
      },
      {
        field: 'price', required: false, type: 'integer',
      },
      {
        field: 'capacity', required: false, type: 'integer',
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

    const { error, data } = inputValidator(req, fillable);

    data.id = parseInt(id, 10);
    if (error.length > 0) {
      if (req.file) {
        try {
          deleteFile(req.file.filename);
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
          deleteFile(req.file.filename);
        } catch (err) {
          return responseHandler(res, 500, null, null, 'Unexpected Error');
        }
      }
      return responseHandler(res, 400, null, null, 'New data is duplicate of existing data');
    }
    if (data.image && getVehicleData[0].image) {
      try {
        deleteFile(cloudPathToFileName(getVehicleData[0].image));
      } catch (err) {
        return responseHandler(res, 500, null, null, 'Unexpected error');
      }
    }
    const updateVehicleData = await vehicleModel.editVehicleAsync(id, data);
    if (updateVehicleData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }
    const updatedData = await vehicleModel.getVehicleAsync(id);
    return responseHandler(res, 200, `Vehicle with id ${id} has been updated`, updatedData[0]);
  } catch (error) {
    if (req.file) {
      try {
        deleteFile(req.file.filename);
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

const getLocations = async (req, res) => {
  try {
    const results = await vehicleModel.getLocations();
    return responseHandler(res, 200, 'List of Registered Locations', results);
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
  getLocations,
};
