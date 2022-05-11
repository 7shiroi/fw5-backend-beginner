const vehicle = require('express').Router();
const {
  getVehicles,
  getVehicle,
  addVehicle,
  editVehicle,
  deleteVehicle,
  getPopularVehicles,
  getVehiclesFromCategory,
  getLocations,
} = require('../controllers/vehicle');
const uploadImage = require('../helpers/upload');
const { verifyUser } = require('../helpers/auth');

vehicle.get('/', getVehicles);
vehicle.post('/', verifyUser, uploadImage('image'), addVehicle);
vehicle.get('/popular', getPopularVehicles);
vehicle.get('/locations', getLocations);
vehicle.get('/category/:id', getVehiclesFromCategory);
vehicle.get('/:id', getVehicle);
vehicle.patch('/:id', verifyUser, uploadImage('image'), editVehicle);
vehicle.delete('/:id', verifyUser, deleteVehicle);

module.exports = vehicle;
