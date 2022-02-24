const vehicle = require('express').Router();
const cors = require('cors');
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
const { verifyUser } = require('../helpers/auth');

const corsOptions = {
  origin: 'http://localhost:3000',
};

vehicle.get('/', cors(corsOptions), getVehicles);
vehicle.post('/', verifyUser, uploadImage('image'), addVehicle);
vehicle.get('/popular', cors(corsOptions), getPopularVehicles);
vehicle.get('/category/:id', cors(corsOptions), getVehiclesFromCategory);
vehicle.get('/:id', cors(corsOptions), getVehicle);
vehicle.patch('/:id', verifyUser, uploadImage('image'), editVehicle);
vehicle.delete('/:id', verifyUser, deleteVehicle);

module.exports = vehicle;
