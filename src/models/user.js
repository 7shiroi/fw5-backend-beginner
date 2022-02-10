const db = require('../helpers/db');

exports.getUsers = (data, cb) => {
  db.query(`SELECT * FROM users WHERE email LIKE '${data.email}%' LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getUsersAsync = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT * FROM users WHERE email LIKE '${data.email}%' LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getUser = (id, cb) => {
  db.query('SELECT * FROM users WHERE id=?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getUserAsync = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM users WHERE id=?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getUsersCount = (data, cb) => {
  db.query(`SELECT COUNT(*) rowsCount FROM users WHERE email LIKE '${data.email}%'`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getUsersCountAsync = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT COUNT(*) rowsCount FROM users WHERE email LIKE '${data.email}%'`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getProfile = (id, cb) => {
  db.query('SELECT email, name, phone_number, gender, address, username, birth_date, picture, YEAR(created_at) active_since FROM users WHERE id=?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getProfileAsync = (id) => new Promise((resolve, reject) => {
  db.query('SELECT email, name, phone_number, gender, address, username, birth_date, picture, YEAR(created_at) active_since FROM users WHERE id=?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.checkIfEmailUsed = (data, cb) => {
  const extraQuery = data.id ? `and id != ${data.id}` : '';
  db.query(`SELECT COUNT(*) rowsCount FROM users WHERE email=? ${extraQuery}`, [data.email], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.checkIfEmailUsedAsync = (data) => new Promise((resolve, reject) => {
  const extraQuery = data.id ? `and id != ${data.id}` : '';
  db.query(`SELECT COUNT(*) rowsCount FROM users WHERE email=? ${extraQuery}`, [data.email], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.checkIfUsernameUsedAsync = (data) => new Promise((resolve, reject) => {
  const extraQuery = data.id ? `and id != ${data.id}` : '';
  db.query(`SELECT COUNT(*) rowsCount FROM users WHERE username=? ${extraQuery}`, [data.username], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.addUser = (data, cb) => {
  db.query('INSERT INTO users SET ?', data, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.addUserAsync = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO users SET ?', data, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.editUser = (id, data, cb) => {
  db.query(
    // eslint-disable-next-line max-len
    'UPDATE users SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) throw error;
      cb(res);
    },
  );
};

exports.editUserAsync = (id, data) => new Promise((resolve, reject) => {
  db.query(
    'UPDATE users SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) reject(error);
      resolve(res);
    },
  );
});

exports.deleteUser = (id, cb) => {
  db.query('DELETE FROM users WHERE id = ?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.deleteUserAsync = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM users WHERE id = ?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getUserByUsernameAsync = (username) => new Promise((resolve, reject) => {
  db.query('SELECT id, username, email, password, id_role role FROM users where username=?', username, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
