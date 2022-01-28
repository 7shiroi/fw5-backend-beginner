const db = require('../helpers/db');

exports.getHistories = (cb) => {
  db.query('SELECT * FROM histories', (error, res) => {
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

exports.getHistory = (id, cb) => {
  db.query('SELECT * FROM histories WHERE id=?', [id], (error, res) => {
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

exports.addHistory = (data, cb) => {
  db.query('INSERT INTO histories SET ?', data, (error, res) => {
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

exports.editHistory = (id, data, cb) => {
  db.query(
    // eslint-disable-next-line max-len
    'UPDATE histories SET ? WHERE id = ?',
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

exports.deleteHistory = (id, cb) => {
  db.query('DELETE FROM histories WHERE id = ?', [id], (error, res) => {
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
