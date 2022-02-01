const route = require('express').Router();
const { getPopularVehicles } = require('../controllers/vehicle');
const { getProfile } = require('../controllers/user');

route.use('/vehicle', require('./vehicle'));
route.use('/user', require('./user'));
route.use('/history', require('./history'));

route.get('/popular', getPopularVehicles);
route.get('/profile/:id', getProfile);

module.exports = route;
