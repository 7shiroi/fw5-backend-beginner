const vehicle = require('express').Router();

const {
  getVehicles,
  getVehicle,
  addVehicle,
  editVehicle,
  deleteVehicle,
  getPopularVehicles,
} = require('../controllers/vehicle');

vehicle.get('/popular', getPopularVehicles);
vehicle.get('/', getVehicles);
vehicle.get('/:id', getVehicle);
vehicle.post('/', addVehicle);
vehicle.patch('/:id', editVehicle);
vehicle.delete('/:id', deleteVehicle);

module.exports = vehicle;
