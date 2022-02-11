const db = require('../helpers/db');

exports.getUserRequestPasswordByEmail = (email) => new Promise((resolve, reject) => {
  db.query(`SELECT email, code FROM user_request_password urp
  JOIN users u ON urp.id_user = u.id
  WHERE u.email=? AND urp.is_expired=0 AND TIMESTAMPDIFF(MINUTE, urp.created_at, NOW()) < 15`, [email], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.insertUserRequestPassword = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO user_request_password SET ?', data, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getUserRequestPasswordById = (id) => new Promise((resolve, reject) => {
  db.query(`SELECT email, code FROM user_request_password urp 
  JOIN users u ON urp.id_user = u.id 
  WHERE urp.id=?`, [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getUserRequestPasswordByEmailAndCode = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT urp.id id_req, u.id id_user, email, code FROM user_request_password urp
  JOIN users u ON urp.id_user = u.id
  WHERE u.email=? AND urp.code=? AND urp.is_expired=0 AND TIMESTAMPDIFF(MINUTE, urp.created_at, NOW()) < 15`, [data.email, data.code], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.updateExpiryCode = (id, data) => new Promise((resolve, reject) => {
  db.query('UPDATE user_request_password SET ? WHERE id=?', [data, id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
