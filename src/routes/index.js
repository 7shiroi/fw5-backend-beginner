const route = require('express').Router();

route.use('/vehicle', require('./vehicle'));
route.use('/user', require('./user'));
route.use('/history', require('./history'));

module.exports = route;
