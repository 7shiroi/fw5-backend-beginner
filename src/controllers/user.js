/* eslint-disable consistent-return */
const argon2 = require('argon2');
const userModel = require('../models/user');
const roleModel = require('../models/role');
const {
  idValidator, emailValidation, passwordValidation, phoneNumberValidation, dateValidation,
} = require('../helpers/validator');
const responseHandler = require('../helpers/responseHandler');

const getUsers = async (req, res) => {
  try {
    let { email, page, limit } = req.query;
    email = email || '';
    page = page || 1;
    limit = limit || 5;
    const offset = (page - 1) * limit;
    const data = { email, limit, offset };

    const count = await userModel.getUsersCountAsync(data);
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      const results = await userModel.getUsersAsync(data);
      if (results.length > 0) {
        const pageInfo = {
          prev: page > 1 ? `http://localhost:5000/user?email=${email}&page=${page - 1}&limit=${limit}` : null,
          next: page < lastPage ? `http://localhost:5000/user?email=${email}&page=${page + 1}&limit=${limit}` : null,
          totalData: rowsCount,
          currentPage: page,
          lastPage,
        };
        return responseHandler(res, 200, 'List Users', results, null, pageInfo);
      }
      return responseHandler(res, 400, 'List not found', results);
    }
    return responseHandler(res, 400, 'List not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error!');
  }
};

const getUser = async (req, res) => {
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    const { id } = req.params;
    const results = await userModel.getUserAsync(id);
    if (results.length > 0) {
      return responseHandler(res, 200, 'Detail user', results[0]);
    }
    return responseHandler(res, 404, 'User not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error!');
  }
};

const getProfile = async (req, res) => {
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    let { id } = req.params;
    id = id || 0;
    const results = await userModel.getProfileAsync(id);
    if (results.length > 0) {
      return responseHandler(res, 200, 'User Profile', results[0]);
    }
    return responseHandler(res, 404, 'User not found');
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error!');
  }
};

// eslint-disable-next-line require-jsdoc
function validateDataUser(data) {
  // expected data {email, password, name, phone_number, address,
  // username, gender, birth_date, picture(nullable)}
  const error = [];

  if (data.email === undefined || !emailValidation(data.email)) {
    error.push('Input parameter email salah!');
  }
  if (data.password === undefined || !passwordValidation(data.password)) {
    error.push('Input parameter password salah!');
  }
  if (data.name === undefined || data.name.length === 0) {
    error.push('Input parameter nama salah!');
  }
  if (
    data.phone_number === undefined
    || !phoneNumberValidation(data.phone_number)
    || data.phone_number.length < 6
    || data.phone_number.length > 16
  ) {
    error.push('Input parameter nomor telepon salah!');
  }
  if (
    data.address === undefined || data.address.length === 0
  ) {
    error.push('Input parameter alamat salah!');
  }
  if (
    data.username === undefined
    || data.username.length === 0
  ) {
    error.push('Input parameter display name salah!');
  }
  if (data.username.length > 32) {
    error.push('Display name terlalu panjang');
  }
  if (
    data.gender === undefined
    || !['male', 'female'].includes(data.gender.toLowerCase())
  ) {
    error.push('Input parameter jenis kelamin salah!');
  }
  if (
    data.birth_date === undefined
    || !dateValidation(data.birth_date)
  ) {
    error.push('Input parameter tanggal lahir salah!');
  }
  return error;
}

const addUser = async (req, res) => {
  try {
    if (!req.user || req.user.role > 2) {
      return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
    }
    const data = req.body;
    const error = validateDataUser(data);
    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }

    const emailFound = await userModel.checkIfEmailUsedAsync(data);
    if (emailFound[0].rowsCount) {
      return responseHandler(res, 400, null, null, 'Email has already been used');
    }
    const usernameFound = await userModel.checkIfUsernameUsedAsync(data);
    if (usernameFound[0].rowsCount) {
      return responseHandler(res, 400, null, null, 'Username has already been used');
    }
    const roleFound = await roleModel.getRoleAsync(data.id_role);
    if (roleFound.length === 0) {
      return responseHandler(res, 400, null, null, 'User role not found');
    }

    try {
      data.password = await argon2.hash(data.password);
    } catch (err) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }

    const result = await userModel.addUserAsync(data);
    return responseHandler(res, 200, `${result.affectedRows} user added`, data);
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const editUser = async (req, res) => {
  try {
    if (!req.user || req.user.role > 2) {
      return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
    }
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    const data = req.body;
    data.id = req.params.id || 0;
    const error = validateDataUser(data);
    if (error.length > 0) {
      return responseHandler(res, 400, null, null, error);
    }

    const results = await userModel.getUserAsync(data.id);
    if (results.length > 0) {
      const emailFound = await userModel.checkIfEmailUsedAsync(data);
      if (emailFound[0].rowsCount) {
        return responseHandler(res, 400, null, null, 'Email has already been used');
      }
      const usernameFound = await userModel.checkIfUsernameUsedAsync(data);
      if (usernameFound[0].rowsCount) {
        return responseHandler(res, 400, null, null, 'Username has already been used');
      }
      const roleFound = await roleModel.getRoleAsync(data.id_role);
      if (roleFound.length === 0) {
        return responseHandler(res, 400, null, null, 'User role not found');
      }

      try {
        await userModel.editUserAsync(data.id, data, () => responseHandler(res, 200, `User with id ${data.id} has been updated`, data));
      } catch (err) {
        return responseHandler(res, 500, null, null, 'Unexpected Error');
      }
    } else {
      return responseHandler(res, 400, null, null, 'User not found');
    }
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role > 2) {
      return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
    }
    if (!idValidator(req.params)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    const { id } = req.params;

    const results = await userModel.getUserAsync(id);
    if (results.length > 0) {
      try {
        await userModel.deleteUserAsync(id);
        return responseHandler(res, 200, `User with id ${id} has been deleted`);
      } catch (error) {
        return responseHandler(res, 500, null, null, 'Unexpected Error');
      }
    } else {
      return responseHandler(res, 404, 'User not found');
    }
  } catch (error) {
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
  getProfile,
};
