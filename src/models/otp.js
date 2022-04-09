const db = require('../helpers/db');

exports.getOtpByEmail = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT email, code FROM otp o
  JOIN users u ON o.id_user = u.id
  WHERE u.email=? 
    AND o.is_expired=0
    AND o.id_otp_type=?
    AND TIMESTAMPDIFF(MINUTE, o.created_at, NOW()) < 15`, [data.email, data.id_otp_type], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getOtpByIdUser = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT id id_req, id_user, code FROM otp
  WHERE id_user=?
    AND is_expired=0
    AND id_otp_type=?
    AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) < 15`, [data.id_user, data.id_otp_type], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.insertOtp = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO otp SET ?', data, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getOtpById = (id) => new Promise((resolve, reject) => {
  db.query(`SELECT email, code FROM otp o 
  JOIN users u ON o.id_user = u.id 
  WHERE o.id=?`, [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getOtpByEmailAndCode = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT o.id id_req, u.id id_user, email, code FROM otp o
  JOIN users u ON o.id_user = u.id
  WHERE u.email=?
    AND o.code=?
    AND o.id_otp_type=?
    AND o.is_expired=0 
    AND TIMESTAMPDIFF(MINUTE, o.created_at, NOW()) < 15`, [data.email, data.code, data.id_otp_type], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.updateExpiryCode = (id, data) => new Promise((resolve, reject) => {
  db.query('UPDATE otp SET ? WHERE id=?', [data, id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
