const qs = require('qs');
const responseHandler = require('../helpers/responseHandler');
const { inputValidator } = require('../helpers/validator');
const favoriteVehicleModel = require('../models/userFavoriteVehicle');
const vehicleModel = require('../models/vehicle');

const getUserFavoriteVehicle = async (req, res) => {
  try {
    const idUser = req.user.id;
    let { page, limit } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;
    const offset = (page - 1) * limit;
    const data = { idUser, limit, offset };

    const count = await favoriteVehicleModel.getCountData(data);
    const { rowsCount } = count[0];
    if (rowsCount === 0) {
      return responseHandler(res, 200, 'List not found', []);
    }

    const lastPage = Math.ceil(rowsCount / limit);
    const results = await favoriteVehicleModel.getAllUserFavoriteVehicle(data);
    if (results.length === 0) {
      return responseHandler(res, 404, 'Cannot find the page you are looking for');
    }
    const pageInfo = {
      prev: page > 1 ? `http://localhost:5000/favorite?${qs.stringify({ page: page - 1, limit })}` : null,
      next: page < lastPage ? `http://localhost:5000/favorite?${qs.stringify({ page: page + 1, limit })}` : null,
      totalData: rowsCount,
      currentPage: page,
      lastPage,
    };
    return responseHandler(res, 200, 'List user favorite vehicles', results, null, pageInfo);
  } catch (error) {
    console.log(error);
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const idUser = req.user.id;
    const fillable = [
      {
        field: 'idVehicle', required: true, type: 'integer',
      },
    ];

    const { error, data } = inputValidator(req, fillable);
    if (error.length > 0) {
      return res.status(400).json({
        success: false,
        error,
      });
    }
    const checkVehicle = await vehicleModel.getVehicleAsync(data.idVehicle);
    if (checkVehicle.length === 0) {
      return responseHandler(res, 400, 'Vehicle not found');
    }
    data.idUser = idUser;
    const checkUserFavoriteVehicle = await favoriteVehicleModel.checkUserFavoriteVehicle(data);
    if (checkUserFavoriteVehicle.length > 0) {
      await favoriteVehicleModel.deleteUserFavoriteVehicle(checkUserFavoriteVehicle[0].id);
      return responseHandler(res, 200, `You no longer favorite vehicle with id ${data.idVehicle}!`);
    }
    await favoriteVehicleModel
      .addUserFavoriteVehicle({ id_user: data.idUser, id_vehicle: data.idVehicle });
    return responseHandler(res, 200, `You have set vehicle with id ${data.idVehicle} as one of your favorites!`);
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

module.exports = {
  getUserFavoriteVehicle,
  toggleFavorite,
};
