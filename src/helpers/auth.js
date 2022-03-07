const jwt = require('jsonwebtoken');
const responseHandler = require('./responseHandler');
const userModel = require('../models/user');

const { APP_SECRET } = process.env;

exports.verifyUser = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    const token = auth.split(' ')[1];
    if (token) {
      try {
        const payload = jwt.verify(token, APP_SECRET);
        req.user = payload;
        if (payload) {
          return next();
        }
        return responseHandler(res, 401, 'Please login first!');
      } catch (err) {
        return responseHandler(res, 401, 'Please login first!');
      }
    } else {
      return responseHandler(res, 401, 'Please login first!');
    }
  }
  return responseHandler(res, 401, 'Please login first!');
};

exports.checkVerified = async (req, res, next) => {
  const idUser = req.user.id;
  const userData = await userModel.getUserAsync(idUser);
  if (userData.length === 0) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
  if (userData[0].is_verified === 1) {
    return next();
  }
  return responseHandler(res, 403, 'Please verify your account first!');
};
