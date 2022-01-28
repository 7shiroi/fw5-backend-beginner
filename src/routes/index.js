const route = require('express').Router();

route.use('/vehicle', require('./vehicle'));
route.use('/user', require('./user'));

module.exports = route;
