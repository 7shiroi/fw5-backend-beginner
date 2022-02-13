const route = require('express').Router();
const { getPopularVehicles } = require('../controllers/vehicle');
const responseHandler = require('../helpers/responseHandler');

route.use('/category', require('./category'));
route.use('/vehicle', require('./vehicle'));
route.use('/user', require('./user'));
route.use('/history', require('./history'));
route.use('/auth', require('./auth'));
route.use('/profile', require('./profile'));

route.get('/popular', getPopularVehicles);

module.exports = route;

route.get('/', (req, res) => responseHandler(res, 200, 'Backend is running well!'));
