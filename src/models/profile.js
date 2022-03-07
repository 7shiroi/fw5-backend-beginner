const db = require('../helpers/db');

exports.getProfile = (id) => new Promise((resolve, reject) => {
  db.query('SELECT id, email, name, phone_number, gender, address, username, birth_date, picture, YEAR(created_at) active_since, is_verified FROM users WHERE id=?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.editProfile = (id, data) => new Promise((resolve, reject) => {
  db.query(
    'UPDATE users SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) reject(error);
      resolve(res);
    },
  );
});

exports.deleteProfile = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM users WHERE id = ?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
