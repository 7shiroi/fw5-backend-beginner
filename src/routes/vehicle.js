const vehicle = require('express').Router();
const {
  getVehicles,
  getVehicle,
  addVehicle,
  editVehicle,
  deleteVehicle,
  getPopularVehicles,
  getVehiclesFromCategory,
} = require('../controllers/vehicle');
const uploadImage = require('../helpers/upload');

vehicle.get('/', getVehicles);
vehicle.post('/', uploadImage.single('image'), addVehicle);
vehicle.get('/popular', getPopularVehicles);
vehicle.get('/category/:id', getVehiclesFromCategory);
vehicle.get('/:id', getVehicle);
vehicle.patch('/:id', uploadImage.single('image'), editVehicle);
vehicle.delete('/:id', deleteVehicle);

module.exports = vehicle;
