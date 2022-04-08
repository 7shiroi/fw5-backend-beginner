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

exports.getHistoriesAsync = (data) => new Promise((resolve, reject) => {
  let extraQueryWhere = '';
  if (data.id_user) {
    extraQueryWhere = ` AND id_user = ${data.id_user}`;
  }
  if (data.lastCreated >= 0) {
    extraQueryWhere += ` AND DATE_SUB(CURDATE(),INTERVAL ${data.lastCreated} DAY) <= h.created_at`;
  }
  db.query(`SELECT 
    h.id history_id, 
    u.email, 
    u.name 'user_name', 
    v.name vehicle_name, 
    v.image,
    h.date_start, 
    h.date_end, 
    h.has_returned, 
    h.prepayment 
    FROM histories h 
  JOIN vehicles v ON h.id_vehicle = v.id 
  JOIN users u ON h.id_user = u.id
  WHERE (v.name LIKE '${data.search}%'
    OR u.email LIKE '${data.search}%'
    OR u.name LIKE '${data.search}%')
    ${extraQueryWhere}
  LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getHistory = (id, cb) => {
  db.query(`SELECT h.id history_id, u.email, u.name 'user_name', v.name vehicle_name, h.date_start, h.date_end, h.has_returned, h.prepayment FROM histories h
  JOIN vehicles v ON h.id_vehicle = v.id 
  JOIN users u ON h.id_user = u.id
  WHERE h.id=?`, [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getHistoryAsync = (id, idUser = null) => new Promise((resolve, reject) => {
  let extraQueryWhere = '';
  if (idUser) {
    extraQueryWhere = `AND id_user=${idUser}`;
  }
  db.query(`SELECT h.id history_id, u.email, u.id 'id_user', u.name 'user_name', v.name vehicle_name, h.date_start, h.date_end, h.has_returned, h.prepayment FROM histories h
  JOIN vehicles v ON h.id_vehicle = v.id 
  JOIN users u ON h.id_user = u.id
  WHERE h.id=? ${extraQueryWhere}`, [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getHistoriesCount = (data, cb) => {
  db.query(`SELECT COUNT(*) rowsCount FROM histories h
  JOIN vehicles v ON h.id_vehicle = v.id 
  JOIN users u ON h.id_user = u.id
  WHERE v.name LIKE '${data.search}%'
    AND u.email LIKE '${data.search}%'`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getHistoriesCountAsync = (data) => new Promise((resolve, reject) => {
  let extraQueryWhere = '';
  if (data.id_user) {
    extraQueryWhere += ` AND id_user = ${data.id_user}`;
  }
  if (data.lastCreated >= 0) {
    extraQueryWhere += ` AND DATE_SUB(CURDATE(),INTERVAL ${data.lastCreated} DAY) <= h.created_at`;
  }
  db.query(`SELECT COUNT(*) rowsCount FROM histories h
  JOIN vehicles v ON h.id_vehicle = v.id 
  JOIN users u ON h.id_user = u.id
  WHERE (v.name LIKE '${data.search}%'
    OR u.email LIKE '${data.search}%'
    OR u.name LIKE '${data.search}%')
  ${extraQueryWhere}`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.addHistory = (data, cb) => {
  db.query('INSERT INTO histories SET ?', data, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.addHistoryAsync = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO histories SET ?', data, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

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

exports.editHistoryAsync = (id, data) => new Promise((resolve, reject) => {
  db.query(
    // eslint-disable-next-line max-len
    'UPDATE histories SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) reject(error);
      resolve(res);
    },
  );
});

exports.deleteHistory = (id, cb) => {
  db.query('DELETE FROM histories WHERE id = ?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.deleteHistoryAsync = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM histories WHERE id = ?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
