const db = require('../helpers/db');

exports.getHistories = (data, cb) => {
  db.query(`SELECT h.id history_id, u.email, v.name vehicle_name, h.date_start, h.date_end, h.has_returned, h.prepayment FROM histories h 
  JOIN vehicles v ON h.id_vehicle = v.id 
  JOIN users u ON h.id_user = u.id
  WHERE v.name LIKE '${data.vehicleName}%'
    AND u.email LIKE '${data.email}%'
  LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getHistory = (id, cb) => {
  db.query('SELECT * FROM histories WHERE id=?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getHistoriesCount = (data, cb) => {
  db.query(`SELECT COUNT(*) rowsCount FROM histories h
  JOIN vehicles v ON h.id_vehicle = v.id 
  JOIN users u ON h.id_user = u.id
  WHERE v.name LIKE '${data.vehicleName}%'
    AND u.email LIKE '${data.email}%'`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.addHistory = (data, cb) => {
  db.query('INSERT INTO histories SET ?', data, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.editHistory = (id, data, cb) => {
  db.query(
    // eslint-disable-next-line max-len
    'UPDATE histories SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) throw error;
      cb(res);
    },
  );
};

exports.deleteHistory = (id, cb) => {
  db.query('DELETE FROM histories WHERE id = ?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};
