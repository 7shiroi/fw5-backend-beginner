/* eslint-disable consistent-return */
const db = require('../helpers/db');

exports.getVehicles = (data, cb) => {
  db.query(`SELECT * FROM vehicles WHERE name LIKE '${data.search}%' LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getVehicle = (id, cb) => {
  db.query('SELECT * FROM vehicles WHERE id=?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getVehicleCount = (data, cb) => {
  db.query(`SELECT COUNT(*) as rowsCount FROM vehicles WHERE name LIKE '${data.search}%'`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.addVehicle = (data, cb) => {
  db.query('INSERT INTO vehicles SET ?', data, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.editVehicle = (id, data, cb) => {
  db.query(
    // eslint-disable-next-line max-len
    'UPDATE vehicles SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) throw error;
      cb(res);
    },
  );
};

exports.deleteVehicle = (id, cb) => {
  db.query('DELETE FROM vehicles WHERE id = ?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};
