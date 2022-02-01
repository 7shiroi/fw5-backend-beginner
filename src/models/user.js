const db = require('../helpers/db');

exports.getUsers = (data, cb) => {
  db.query(`SELECT * FROM users WHERE email LIKE '${data.email}%' LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getUser = (id, cb) => {
  db.query('SELECT * FROM users WHERE id=?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getUsersCount = (data, cb) => {
  db.query(`SELECT COUNT(*) rowsCount FROM users WHERE email LIKE '${data.email}%'`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getProfile = (id, cb) => {
  db.query('SELECT email, name, phone_number, gender, address, display_name, birth_date, picture, YEAR(created_at) active_since FROM users WHERE id=?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.checkIfEmailUsed = (data, cb) => {
  const extraQuery = data.id ? `and id != ${data.id}` : '';
  db.query(`SELECT COUNT(*) rowsCount FROM users WHERE email=? ${extraQuery}`, [data.email], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.addUser = (data, cb) => {
  db.query('INSERT INTO users SET ?', data, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

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

exports.deleteUser = (id, cb) => {
  db.query('DELETE FROM users WHERE id = ?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};
