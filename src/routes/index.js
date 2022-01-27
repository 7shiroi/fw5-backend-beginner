const route = require('express').Router();

route.use('/vehicle', require('./vehicle'));

module.exports = route;
