/* eslint-disable max-len */
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const responseHandler = require('../helpers/responseHandler');
const {
  passwordValidation, inputValidator, comparePassword,
} = require('../helpers/validator');
const userModel = require('../models/user');
const userReqPassword = require('../models/userRequestPassword');
const mail = require('../helpers/mail');

const { APP_SECRET, APP_EMAIL } = process.env;

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
    const fillable = [
      {
        field: 'name', required: true, type: 'varchar', max_length: 100,
      },
      {
        field: 'email', required: true, type: 'email', max_length: 100,
      },
      {
        field: 'username', required: true, type: 'varchar', max_length: 32,
      },
      {
        field: 'password', required: true, type: 'password',
      },
      {
        field: 'confirmPassword', required: true, type: 'password', by_pass_validation: true,
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    const usernameCheck = await userModel.getUserByUsernameAsync(data.username);
    if (usernameCheck.length > 0) {
      error.push('Username has been used');
    }
    const emailCheck = await userModel.getUserByEmailAsync(data.email);
    if (emailCheck.length > 0) {
      error.push('Email has been used');
    }
    if (comparePassword(data.password, data.passwordConfirm)) {
      error.push('Confirm password is not same');
    }
    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }

    delete data.confirmPassword;

    try {
      data.password = await argon2.hash(data.password);
    } catch (err) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email, code, confirmPassword } = req.body;
    let { password } = req.body;
    if (!code) {
      const emailCheck = await userModel.getUserByEmailAsync(email);
      if (emailCheck.length === 0) {
        return responseHandler(res, 400, 'Invalid email');
      }
      const codeByEmail = await userReqPassword.getUserRequestPasswordByEmail(email);
      if (codeByEmail.length > 0) {
        return responseHandler(res, 400, 'Code for your password reset has been sent to your email, please check it!');
      }

      let randomCode = '';
      while (randomCode.length < 6) {
        randomCode += Math.floor(Math.random() * 9);
      }

      const data = { id_user: emailCheck[0].id, code: randomCode };
      const addUserRequestPassword = await userReqPassword.insertUserRequestPassword(data);
      if (addUserRequestPassword.affectedRows > 0) {
        const result = await userReqPassword.getUserRequestPasswordById(addUserRequestPassword.insertId);
        if (result.length > 0) {
          try {
            await mail.sendMail({
              from: APP_EMAIL,
              to: email,
              subject: 'Reset Password Request | Backend Beginner',
              text: `${randomCode}`,
              html: `Please use this code below to reset your password<br><b>${randomCode}</b>`,
            });
            return responseHandler(res, 200, 'Your code for your password reset has been sent to your email!');
          } catch (error) {
            return responseHandler(res, 500, null, null, 'Unexpected Error');
          }
        }
        return responseHandler(res, 500, null, null, 'Unexpected Error');
      }
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }

    const data = { email, code };
    const checkCode = await userReqPassword.getUserRequestPasswordByEmailAndCode(data);
    if (checkCode.length === 0) {
      return responseHandler(res, 400, 'Invalid code or email');
    }
    if (!password || !passwordValidation(password)) {
      return responseHandler(res, 400, 'Password must longer than 8 characters and contain at lease 1 Uppercase, 1 Lowercase and 1 Number');
    }
    if (password !== confirmPassword) {
      return responseHandler(res, 400, 'Confirm password is not same');
    }

    try {
      password = await argon2.hash(password);
    } catch (error) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }

    const updateCodeExpiry = await userReqPassword.updateExpiryCode(checkCode[0].id_req, { is_expired: 1 });
    if (updateCodeExpiry.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }

    const changePassword = await userModel.editUserAsync(checkCode[0].id_user, { password });
    if (changePassword.affectedRows > 0) {
      return responseHandler(res, 200, 'Your password has been updated');
    }
    return responseHandler(res, 500, null, null, 'Unexpected error');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};
