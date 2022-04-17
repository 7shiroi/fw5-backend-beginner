const transactionStatus = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const { toggleFavorite, getUserFavoriteVehicle } = require('../controllers/userFavoriteVehicle');

transactionStatus.get('/', verifyUser, getUserFavoriteVehicle);
transactionStatus.post('/', verifyUser, toggleFavorite);

module.exports = transactionStatus;
