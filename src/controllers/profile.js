const argon2 = require('argon2');
const { deleteFile } = require('../helpers/fileHandler');
const responseHandler = require('../helpers/responseHandler');
const { inputValidator, comparePassword } = require('../helpers/validator');
const profileModel = require('../models/profile');
const userModel = require('../models/user');

const { APP_URL } = process.env;

const getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const results = await profileModel.getProfile(id);
    if (results.length > 0) {
      const mapResults = results.map((o) => {
        if (o.picture !== null) {
        // eslint-disable-next-line no-param-reassign
          o.picture = `${APP_URL}/${o.picture}`;
        }
        return o;
      });
      return responseHandler(res, 200, 'User Profile', mapResults[0]);
    }
    return responseHandler(res, 404, 'User not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error!');
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const results = await profileModel.getProfile(id);
    if (results.length === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    const fillable = [
      {
        field: 'name', required: false, type: 'varchar', max_length: 100,
      },
      {
        field: 'email', required: false, type: 'varchar', max_length: 100,
      },
      {
        field: 'username', required: false, type: 'varchar', max_length: 32,
      },
      {
        field: 'phone_number', required: false, type: 'varchar', max_length: 16,
      },
      {
        field: 'address', required: false, type: 'text',
      },
      {
        field: 'gender', required: false, type: 'enum', options: ['male', 'female'],
      },
      {
        field: 'birth_date', required: false, type: 'date',
      },
    ];

    const { error, data } = inputValidator(req, fillable);
    if (error.length > 0) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 400, null, null, error);
    }

    if (data.email) {
      const emailFound = await userModel.checkIfEmailUsedAsync(data);
      if (emailFound[0].rowsCount) {
        if (req.file) {
          try {
            deleteFile(req.file.path);
          } catch (err) {
            return responseHandler(res, 500, null, null, err.message);
          }
        }
        return responseHandler(res, 400, null, null, 'Email has already been used');
      }
    }
    if (data.username) {
      const usernameFound = await userModel.checkIfUsernameUsedAsync(data);
      if (usernameFound[0].rowsCount) {
        if (req.file) {
          try {
            deleteFile(req.file.path);
          } catch (err) {
            return responseHandler(res, 500, null, null, err.message);
          }
        }
        return responseHandler(res, 400, null, null, 'Username has already been used');
      }
    }
    if (data.phone_number) {
      const phoneNumberFound = await userModel.checkIfPhoneNumberUsedAsync(data);
      if (phoneNumberFound[0].rowsCount) {
        if (req.file) {
          try {
            deleteFile(req.file.path);
          } catch (err) {
            return responseHandler(res, 500, null, null, err.message);
          }
        }
        return responseHandler(res, 400, null, null, 'Phone number has already been used');
      }
    }

    if (req.file) {
      if (results[0].picture) {
        try {
          deleteFile(results[0].picture);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      data.picture = req.file.path;
    }

    const editProfileData = await profileModel.editProfile(id, data);
    if (editProfileData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    const updatedData = await profileModel.getProfile(id);
    if (updatedData.length === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    return responseHandler(res, 200, `User with id ${id} has been updated`, updatedData);
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error!');
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const results = await userModel.getUserAsync(id);
    if (results.length === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error!');
    }

    const fillable = [
      {
        field: 'oldPassword', required: false, type: 'password', by_pass_validation: true,
      },
      {
        field: 'newPassword', required: false, type: 'password',
      },
      {
        field: 'confirmPassword', required: false, type: 'password', by_pass_validation: true,
      },
    ];

    const { error, data } = inputValidator(req, fillable);
    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }
    if (!await argon2.verify(results[0].password, data.oldPassword)) {
      return responseHandler(res, 400, null, null, 'Incorrect old password!');
    }

    if (!comparePassword(data.newPassword, data.confirmPassword)) {
      return responseHandler(res, 400, null, null, 'Confirm password is not same with new password!');
    }
    if (comparePassword(data.newPassword, data.oldPassword)) {
      return responseHandler(res, 400, null, null, 'Your new password must be different with your old one!');
    }
    try {
      data.newPassword = await argon2.hash(data.newPassword);
    } catch (err) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }
    const updatePassword = await userModel.editUserAsync(id, { password: data.newPassword });
    if (updatePassword.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }
    return responseHandler(res, 200, 'Your password has been changed!');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error!');
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
