const db = require('../helpers/db');

exports.getAllTransactionStatus = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT * FROM transaction_status WHERE name LIKE '${data.search}%'`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getTransactionStatus = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM transaction_status WHERE id=?', id, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.checkTransactionStatus = (data) => new Promise((resolve, reject) => {
  db.query('SELECT COUNT(*) checkCount FROM transaction_status WHERE name = ?', [data.name], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.addTransactionStatus = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO transaction_status SET ?', data, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.editTransactionStatus = (id, data) => new Promise((resolve, reject) => {
  db.query(
    'UPDATE transaction_status SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) reject(error);
      resolve(res);
    },
  );
});

exports.deleteTransactionStatus = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM transaction_status WHERE id = ?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
