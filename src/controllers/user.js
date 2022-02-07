/* eslint-disable consistent-return */
const userModel = require('../models/user');

const getUsers = (req, res) => {
  let { email, page, limit } = req.query;
  email = email || '';
  page = page || 1;
  limit = limit || 5;
  const offset = (page - 1) * limit;
  const data = { email, limit, offset };

  userModel.getUsersCount(data, (count) => {
    const { rowsCount } = count[0];
    if (rowsCount > 0) {
      const lastPage = Math.ceil(rowsCount / limit);

      userModel.getUsers(data, (results) => {
        if (results.length > 0) {
          return res.json({
            success: true,
            message: 'List Users',
            pageInfo: {
              prev: page > 1 ? `http://localhost:5000/user?email=${email}&page=${page - 1}&limit=${limit}` : null,
              next: page < lastPage ? `http://localhost:5000/user?email=${email}&page=${page + 1}&limit=${limit}` : null,
              totalData: rowsCount,
              currentPage: page,
              lastPage,
            },
            results,
          });
        }
        return res.status(404).json({
          success: false,
          message: 'List not found',
        });
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'List not found',
      });
    }
  });
};

const getUser = (req, res) => {
  const { id } = req.params;
  userModel.getUser(id, (results) => {
    if (results.length > 0) {
      return res.json({
        success: true,
        message: 'Detail User',
        results: results[0],
      });
    }
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  });
};

const getProfile = (req, res) => {
  let { id } = req.params;
  id = id || 0;
  userModel.getProfile(id, (results) => {
    if (results.length > 0) {
      return res.json({
        success: true,
        message: 'User Profile',
        results: results[0],
      });
    }
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  });
};

const checkPhoneNumber = (data) => /^[+0]\d+$/.test(data);
const dateValidation = (data) => /^[^0]\d{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(data);
const emailValidation = (data) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data);
const passwordValidation = (data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})/.test(data);

// eslint-disable-next-line require-jsdoc
function validateDataUser(data) {
  // expected data {email, password, name, phone_number, address,
  // display_name, gender, birth_date, picture(nullable)}
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
    || !checkPhoneNumber(data.phone_number)
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
    data.display_name === undefined
    || data.display_name.length === 0
  ) {
    error.push('Input parameter display name salah!');
  }
  if (data.display_name.length > 32) {
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

const addUser = (req, res) => {
  const data = req.body;
  const error = validateDataUser(data);
  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  userModel.checkIfEmailUsed(data, (emailFound) => {
    if (emailFound[0].rowsCount) {
      return res.status(400).json({
        success: false,
        error: 'Email is already used',
      });
    }

    userModel.addUser(data, (result) => res.json({
      success: true,
      message: `${result.affectedRows} user added`,
      results: data,
    }));
  });
};

const editUser = (req, res) => {
  const data = req.body;
  data.id = req.params.id || 0;
  const error = validateDataUser(data);
  if (error.length > 0) {
    return res.status(400).json({
      success: false,
      error,
    });
  }

  userModel.getUser(data.id, (results) => {
    if (results.length > 0) {
      userModel.checkIfEmailUsed(data, (emailFound) => {
        if (emailFound[0].rowsCount) {
          return res.status(400).json({
            success: false,
            error: 'Email is already used',
          });
        }
        userModel.editUser(data.id, data, () => res.json({
          success: true,
          message: `User with id ${data.id} has been updated`,
          results: data,
        }));
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  });
};

const deleteUser = (req, res) => {
  let { id } = req.params;
  id = id || 0;

  userModel.getUser(id, (results) => {
    if (results.length > 0) {
      userModel.deleteUser(id, () => res.json({
        success: true,
        message: `User with id ${id} has been deleted`,
        data: results,
      }));
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  });
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
  getProfile,
};
