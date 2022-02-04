/* eslint-disable consistent-return */
const db = require('../helpers/db');

exports.getVehicles = (data, cb) => {
  let extraQueryOrder = '';
  let extraQueryWhere = '';
  if (data.isAvailable.length > 0) {
    extraQueryWhere += `AND is_available = ${data.isAvailable} `;
  }
  if (data.hasPrepayment.length > 0) {
    extraQueryWhere += `AND has_prepayment = ${data.hasPrepayment} `;
  }
  if (data.sort.length > 0) {
    extraQueryOrder += `ORDER BY ${data.sort} ${data.order}`;
  }
  db.query(`SELECT 
    v.id, 
    v.name, 
    c.name category, 
    v.color, 
    v.location, 
    v.stock, 
    v.price, 
    v.capacity, 
    v.is_available, 
    v.has_prepayment, 
    v.reservation_deadline 
  FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE (v.name LIKE '${data.search}%'
    OR c.name LIKE '${data.search}%'
    OR location LIKE '${data.search}%'
    OR color LIKE '${data.search}%')
    ${extraQueryWhere}
  ${extraQueryOrder}
  LIMIT ${data.limit} OFFSET ${data.offset}
  `, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getVehicleCount = (data, cb) => {
  let extraQueryWhere = '';
  if (data.isAvailable.length > 0) {
    extraQueryWhere += `AND is_available = ${data.isAvailable} `;
  }
  if (data.hasPrepayment.length > 0) {
    extraQueryWhere += `AND has_prepayment = ${data.hasPrepayment} `;
  }
  db.query(`SELECT COUNT(*) as rowsCount FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE (v.name LIKE '${data.search}%'
    OR c.name LIKE '${data.search}%'
    OR location LIKE '${data.search}%'
    OR color LIKE '${data.search}%')
    ${extraQueryWhere}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getPopularVehicles = (data, cb) => {
  let extraQueryOrder = '';
  let extraQueryWhere = '';
  if (data.isAvailable.length > 0) {
    extraQueryWhere += `AND is_available = ${data.isAvailable} `;
  }
  if (data.hasPrepayment.length > 0) {
    extraQueryWhere += `AND has_prepayment = ${data.hasPrepayment} `;
  }
  if (data.sort.length > 0) {
    extraQueryOrder += `,${data.sort} ${data.order} `;
  }
  db.query(`SELECT 
    v.id, 
    v.name, 
    c.name category,
    v.color, 
    v.location, 
    v.stock, 
    v.price, 
    v.capacity, 
    v.is_available, 
    v.has_prepayment, 
    v.reservation_deadline,
    (SELECT count(*) from histories where histories.id_vehicle = v.id AND DATEDIFF(CURRENT_DATE, date_start) < 31) history_count
  FROM vehicles v 
  LEFT JOIN categories c on v.id_category = c.id
  WHERE (v.name LIKE '${data.search}%'
    OR c.name LIKE '${data.search}%'
    OR location LIKE '${data.search}%'
    OR color LIKE '${data.search}%')
    ${extraQueryWhere}
  HAVING history_count > 0
  ORDER BY history_count DESC ${extraQueryOrder}
  LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};
exports.getPopularVehiclesCount = (data, cb) => {
  let extraQueryWhere = '';
  if (data.isAvailable.length > 0) {
    extraQueryWhere += `AND is_available = ${data.isAvailable} `;
  }
  if (data.hasPrepayment.length > 0) {
    extraQueryWhere += `AND has_prepayment = ${data.hasPrepayment} `;
  }
  db.query(`SELECT COUNT(*) rowsCount FROM (SELECT v.id, v.name, 
  (SELECT count(*) from histories where histories.id_vehicle = v.id AND DATEDIFF(CURRENT_DATE, date_start) < 31) history_count
  FROM vehicles v 
  LEFT JOIN categories c on v.id_category = c.id
  WHERE (v.name LIKE '${data.search}%'
    OR c.name LIKE '${data.search}%'
    OR location LIKE '${data.search}%'
    OR color LIKE '${data.search}%')
    ${extraQueryWhere}
  HAVING history_count > 0) getPopularVehicleCount`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};
exports.getVehicle = (id, cb) => {
  db.query(`SELECT 
    v.id, 
    v.name, 
    c.name category, 
    v.color, 
    v.location, 
    v.stock, 
    v.price, 
    v.capacity, 
    v.is_available, 
    v.has_prepayment, 
    v.reservation_deadline 
  FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE v.id=?`, [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getVehiclesFromCategory = (data, cb) => {
  db.query(`SELECT 
    v.id, 
    v.name, 
    c.name category, 
    v.color, 
    v.location, 
    v.stock, 
    v.price, 
    v.capacity, 
    v.is_available, 
    v.has_prepayment, 
    v.reservation_deadline 
  FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE c.id=${data.id_category}
  LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getVehiclesFromCategoryCount = (data, cb) => {
  db.query(`SELECT COUNT(*) rowsCount FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE c.id=${data.id_category}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.checkVehicle = (data, cb) => {
  db.query(`SELECT COUNT(*) checkCount from vehicles v
  LEFT JOIN categories c on v.id_category = c.id 
  WHERE v.name = ? AND c.id = ? AND v.color = ?`, [data.name, data.id_category, data.color], (error, res) => {
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
