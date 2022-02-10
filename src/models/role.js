const db = require('../helpers/db');

exports.getRoleAsync = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM roles WHERE id=?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
