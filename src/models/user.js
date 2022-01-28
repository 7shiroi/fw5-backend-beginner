const db = require('../helpers/db');

exports.getUsers = (cb) => {
  db.query('SELECT * FROM users', (error, res) => {
    if (error) {
      throw res.status(500).json({
        success: false,
        // query: q.sql,
        error,
      });
    }
    cb(res);
  });
};

exports.getUser = (id, cb) => {
  db.query('SELECT * FROM users WHERE id=?', [id], (error, res) => {
    if (error) {
      throw res.status(500).json({
        success: false,
        // query: q.sql,
        error,
      });
    }
    cb(res);
  });
};

exports.addUser = (data, cb) => {
  db.query('INSERT INTO users SET ?', data, (error, res) => {
    if (error) {
      throw res.status(500).json({
        success: false,
        // query: q.sql,
        error,
      });
    }
    cb(res);
  });
};

exports.editUser = (id, data, cb) => {
  db.query(
    // eslint-disable-next-line max-len
    'UPDATE users SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) {
        throw res.status(500).json({
          success: false,
          // query: q.sql,
          error,
        });
      }
      cb(res);
    },
  );
};

exports.deleteUser = (id, cb) => {
  db.query('DELETE FROM users WHERE id = ?', [id], (error, res) => {
    if (error) {
      throw res.status(500).json({
        success: false,
        //   query: query.sql,
        error,
      });
    }
    cb(res);
  });
};
