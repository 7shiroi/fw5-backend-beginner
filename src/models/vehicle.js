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
  if (data.idCategory.length > 0) {
    extraQueryWhere += `AND c.id = ${data.idCategory} `;
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
    v.image,
    v.is_available, 
    v.has_prepayment, 
    v.reservation_deadline 
  FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE (v.name LIKE '${data.search}%'
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

exports.getVehiclesAsync = (data) => new Promise((resolve, reject) => {
  let extraQueryOrder = '';
  let extraQueryWhere = '';
  if (data.isAvailable.length > 0) {
    extraQueryWhere += `AND is_available = ${data.isAvailable} `;
  }
  if (data.hasPrepayment.length > 0) {
    extraQueryWhere += `AND has_prepayment = ${data.hasPrepayment} `;
  }
  if (data.idCategory.length > 0) {
    extraQueryWhere += `AND c.id = ${data.idCategory} `;
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
    v.image,
    v.is_available, 
    v.has_prepayment, 
    v.reservation_deadline 
  FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE (v.name LIKE '${data.search}%'
    OR location LIKE '${data.search}%'
    OR color LIKE '${data.search}%')
    ${extraQueryWhere}
  ${extraQueryOrder}
  LIMIT ${data.limit} OFFSET ${data.offset}
  `, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

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

exports.getVehicleCountAsync = (data) => new Promise((resolve, reject) => {
  let extraQueryWhere = '';
  if (data.isAvailable.length > 0) {
    extraQueryWhere += `AND is_available = ${data.isAvailable} `;
  }
  if (data.hasPrepayment.length > 0) {
    extraQueryWhere += `AND has_prepayment = ${data.hasPrepayment} `;
  }
  if (data.idCategory.length > 0) {
    extraQueryWhere += `AND c.id = ${data.idCategory} `;
  }
  db.query(`SELECT COUNT(*) as rowsCount FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE (v.name LIKE '${data.search}%'
    OR location LIKE '${data.search}%'
    OR color LIKE '${data.search}%')
    ${extraQueryWhere}`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

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
    v.image,
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

exports.getPopularVehiclesAsync = (data) => new Promise((resolve, reject) => {
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
    v.image,
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
    if (error) reject(error);
    resolve(res);
  });
});

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

exports.getPopularVehiclesCountAsync = (data) => new Promise((resolve, reject) => {
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
    if (error) reject(error);
    resolve(res);
  });
});

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
    v.image,
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

exports.getVehicleAsync = (id) => new Promise((resolve, reject) => {
  db.query(`SELECT 
    v.id, 
    v.name, 
    c.name category, 
    v.color, 
    v.location, 
    v.stock, 
    v.price, 
    v.capacity, 
    v.image,
    v.is_available, 
    v.has_prepayment, 
    v.reservation_deadline 
  FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE v.id=?`, [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

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
    v.image,
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

exports.getVehiclesFromCategoryAsync = (data, id) => new Promise((resolve, reject) => {
  let extraQueryOrder = '';
  let extraQueryWhere = '';
  if (data.isAvailable.length > 0) {
    extraQueryWhere += `AND is_available = ${data.isAvailable} `;
  }
  if (data.hasPrepayment.length > 0) {
    extraQueryWhere += `AND has_prepayment = ${data.hasPrepayment} `;
  }
  if (data.sort.length > 0) {
    extraQueryOrder += `ORDER BY ${data.sort} ${data.order} `;
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
    v.image,
    v.is_available, 
    v.has_prepayment, 
    v.reservation_deadline 
  FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE c.id=${id} 
    AND (v.name LIKE '${data.search}%'
      OR location LIKE '${data.search}%'
      OR color LIKE '${data.search}%')
    ${extraQueryWhere}
  ${extraQueryOrder}
  LIMIT ${data.limit} OFFSET ${data.offset}`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getVehiclesFromCategoryCount = (data, cb) => {
  db.query(`SELECT COUNT(*) rowsCount FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE c.id=${data.id_category}`, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.getVehiclesFromCategoryCountAsync = (data, id) => new Promise((resolve, reject) => {
  let extraQueryWhere = '';
  if (data.isAvailable.length > 0) {
    extraQueryWhere += `AND is_available = ${data.isAvailable} `;
  }
  if (data.hasPrepayment.length > 0) {
    extraQueryWhere += `AND has_prepayment = ${data.hasPrepayment} `;
  }
  db.query(`SELECT COUNT(*) rowsCount FROM vehicles v
  LEFT JOIN categories c on v.id_category = c.id
  WHERE c.id=${id}
    AND (v.name LIKE '${data.search}%'
      OR location LIKE '${data.search}%'
      OR color LIKE '${data.search}%')
  ${extraQueryWhere}`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.checkVehicle = (data, cb) => {
  let extraQueryWhere = '';
  if (data.id) {
    extraQueryWhere += `AND v.id != ${data.id}`;
  }
  db.query(`SELECT COUNT(*) checkCount from vehicles v
  LEFT JOIN categories c on v.id_category = c.id 
  WHERE v.name = ? AND c.id = ? AND v.color = ? ${extraQueryWhere}`, [data.name, data.id_category, data.color], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.checkVehicleAsync = (data) => new Promise((resolve, reject) => {
  let extraQueryWhere = '';
  if (data.id) {
    extraQueryWhere += `AND v.id != ${data.id}`;
  }
  db.query(`SELECT COUNT(*) checkCount from vehicles v
  LEFT JOIN categories c on v.id_category = c.id 
  WHERE v.name = ? AND c.id = ? AND v.color = ? ${extraQueryWhere}`, [data.name, data.id_category, data.color], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.addVehicle = (data, cb) => {
  db.query('INSERT INTO vehicles SET ?', data, (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.addVehicleAsync = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO vehicles SET ?', data, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.editVehicle = (id, data, cb) => {
  db.query(
    'UPDATE vehicles SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) throw error;
      cb(res);
    },
  );
};

exports.editVehicleAsync = (id, data) => new Promise((resolve, reject) => {
  db.query(
    'UPDATE vehicles SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) reject(error);
      resolve(res);
    },
  );
});

exports.deleteVehicle = (id, cb) => {
  db.query('DELETE FROM vehicles WHERE id = ?', [id], (error, res) => {
    if (error) throw error;
    cb(res);
  });
};

exports.deleteVehicleAsync = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM vehicles WHERE id = ?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
