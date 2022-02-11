const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const responseHandler = require('../helpers/responseHandler');
const { passwordValidation, emailValidation } = require('../helpers/validator');
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

exports.register = async (req, res) => {
  try {
    const {
      username, email, confirmPassword, name,
    } = req.body;
    let { password } = req.body;
    const err = [];
    if (!name) {
      err.push('Name cannot be empty');
    }
    if (!username) {
      err.push('Username cannot be empty');
    }
    const usernameCheck = await userModel.getUserByUsernameAsync(username);
    if (usernameCheck.length > 0) {
      err.push('Username has been used');
    }
    if (!email || !emailValidation(email)) {
      err.push('Invalid email format');
    }
    const emailCheck = await userModel.getUserByEmailAsync(email);
    if (emailCheck.length > 0) {
      err.push('Email has been used');
    }
    if (!password || !passwordValidation(password)) {
      err.push('Password must longer than 8 characters and contain at lease 1 Uppercase, 1 Lowercase and 1 Number');
    }
    if (password !== confirmPassword) {
      err.push('Confirm password is not same');
    }
    if (err.length > 0) {
      return responseHandler(res, 400, null, null, err);
    }

    try {
      password = await argon2.hash(password);
    } catch (error) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }

    const data = {
      username, email, password, id_role: 3,
    };

    const registerUser = await userModel.addUserAsync(data);
    if (registerUser.affectedRows > 0) {
      const result = await userModel.getUserAsync(registerUser.insertId);
      if (result.length === 0) {
        return responseHandler(res, 500, null, null, 'Unexpected Error');
      }
      return responseHandler(res, 201, 'Register successful', result[0]);
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};