const vehicle = require('express').Router();

const {
  getVehicles,
  getVehicle,
  addVehicle,
  editVehicle,
  deleteVehicle,
} = require('../controllers/vehicle');

vehicle.get('/', getVehicles);
vehicle.get('/:id', getVehicle);
vehicle.post('/add', addVehicle);
vehicle.patch('/edit/:id', editVehicle);
vehicle.delete('/delete/:id', deleteVehicle);

module.exports = vehicle;
