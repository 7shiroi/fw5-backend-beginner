const jwt = require('jsonwebtoken');
const responseHandler = require('./responseHandler');

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
