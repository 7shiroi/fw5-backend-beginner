const route = require('express').Router();
const { getPopularVehicles } = require('../controllers/vehicle');

route.use('/vehicle', require('./vehicle'));
route.use('/user', require('./user'));
route.use('/history', require('./history'));

route.get('/popular', getPopularVehicles);

module.exports = route;
