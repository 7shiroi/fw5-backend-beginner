const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const responseHandler = require('../helpers/responseHandler');
const userModel = require('../models/user');

const { APP_SECRET } = process.env;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const result = await userModel.getUserByUsernameAsync(username);
  if (result.length > 0) {
    if (await argon2.verify(result[0].password, password)) {
      const data = {
        id: result[0].id,
        username: result[0].username,
        role: result[0].role,
      };
      const token = jwt.sign(data, APP_SECRET);
      return responseHandler(res, 200, 'Login success!', token);
    }
    return responseHandler(res, 403, 'Invalid credential!');
  }
  return responseHandler(res, 403, 'Invalid credential!');
};
