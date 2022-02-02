/* eslint-disable consistent-return */
const db = require('../helpers/db');

exports.getCategories = (data, cb) => {
  db.query(`SELECT * FROM categories WHERE name LIKE '${data.search}%'
  LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getCategory = (id, cb) => {
  db.query('SELECT * FROM categories WHERE id=?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getCategoryCount = (data, cb) => {
  db.query(`SELECT COUNT(*) as rowsCount FROM categories WHERE name LIKE '${data.search}%'`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.checkCategory = (data, cb) => {
  db.query('SELECT COUNT(*) checkCount from categories WHERE name = ?', [data.name], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.addCategory = (data, cb) => {
  db.query('INSERT INTO categories SET ?', data, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.editCategory = (id, data, cb) => {
  db.query(
    // eslint-disable-next-line max-len
    'UPDATE categories SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) throw error;
      cb(res);
    },
  );
};

exports.deleteCategory = (id, cb) => {
  db.query('DELETE FROM categories WHERE id = ?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};
