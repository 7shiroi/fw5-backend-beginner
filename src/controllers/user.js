const argon2 = require('argon2');
const userModel = require('../models/user');
const roleModel = require('../models/role');
const {
  idValidator,
  inputValidator,
} = require('../helpers/validator');
const responseHandler = require('../helpers/responseHandler');
const { deleteFile } = require('../helpers/fileHandler');

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

const addUser = async (req, res) => {
  if (!req.user || req.user.role > 2) {
    if (req.file) {
      try {
        deleteFile(req.file.path);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
  } try {
    const fillable = [
      {
        field: 'name', required: true, type: 'varchar', max_length: 100,
      },
      {
        field: 'email', required: true, type: 'varchar', max_length: 100,
      },
      {
        field: 'username', required: true, type: 'varchar', max_length: 32,
      },
      {
        field: 'password', required: true, type: 'password', by_pass_validation: true,
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
      {
        field: 'id_role', required: false, type: 'integer',
      },
    ];
    const { data, error } = inputValidator(req, fillable);
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

    if (!data.id_role) {
      data.id_role = 3;
    }
    const roleFound = await roleModel.getRoleAsync(data.id_role);
    if (roleFound.length === 0) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 400, null, null, 'User role not found');
    }

    try {
      data.password = await argon2.hash(data.password);
    } catch (err) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (errorMsg) {
          return responseHandler(res, 500, null, null, errorMsg.message);
        }
      }
      return responseHandler(res, 500, null, null, 'Unexpected error');
    }

    if (req.file) {
      data.picture = req.file.path;
    }

    const addUserData = await userModel.addUserAsync(data);
    if (addUserData.affectedRows === 0) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    const insertedData = await userModel.getUserAsync(addUserData.insertId);
    if (insertedData.length === 0) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    return responseHandler(res, 200, `${addUserData.affectedRows} user added`, insertedData[0]);
  } catch (error) {
    if (req.file) {
      try {
        deleteFile(req.file.path);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const editUser = async (req, res) => {
  if (!req.user || req.user.role > 2) {
    if (req.file) {
      try {
        deleteFile(req.file.path);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
  }
  try {
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
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
        field: 'password', required: false, type: 'password', by_pass_validation: true,
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
      {
        field: 'id_role', required: false, type: 'integer',
      },
    ];

    const { error, data } = inputValidator(req, fillable);
    data.id = parseInt(req.params.id, 10);

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
    const results = await userModel.getUserAsync(data.id);
    if (results === 0) {
      if (req.file) {
        try {
          deleteFile(req.file.path);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
      return responseHandler(res, 400, null, null, 'User not found');
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
    if (data.id_role) {
      const roleFound = await roleModel.getRoleAsync(data.id_role);
      if (roleFound.length === 0) {
        if (req.file) {
          try {
            deleteFile(req.file.path);
          } catch (err) {
            return responseHandler(res, 500, null, null, err.message);
          }
        }
        return responseHandler(res, 400, null, null, `Id role ${data.id_role} not found`);
      }
    }

    try {
      data.password = await argon2.hash(data.password);
    } catch (err) {
      return responseHandler(res, 500, null, null, 'Unexpected error');
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
    const editUserData = await userModel.editUserAsync(data.id, data);
    if (editUserData.affectedRows === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    const updatedData = await userModel.getUserAsync(data.id);
    if (updatedData.length === 0) {
      return responseHandler(res, 500, null, null, 'Unexpected Error');
    }
    return responseHandler(res, 200, `User with id ${data.id} has been updated`, updatedData);
  } catch (error) {
    if (req.file) {
      try {
        deleteFile(req.file.path);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role > 2) {
      return responseHandler(res, 403, 'FORBIDEN! You are not authorized to do this action!');
    }
    if (!idValidator(req.params.id)) {
      return responseHandler(res, 400, null, null, 'Invalid id format');
    }
    const { id } = req.params;

    const results = await userModel.getUserAsync(id);
    if (results.length > 0) {
      if (results[0].image) {
        try {
          deleteFile(results[0].image);
        } catch (err) {
          return responseHandler(res, 500, null, null, err.message);
        }
      }
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
    if (req.file) {
      try {
        deleteFile(req.file.path);
      } catch (err) {
        return responseHandler(res, 500, null, null, err.message);
      }
    }
    return responseHandler(res, 500, null, null, 'Unexpected Error');
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
};
