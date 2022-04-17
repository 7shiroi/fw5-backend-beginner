const db = require('../helpers/db');

exports.getAllUserFavoriteVehicle = (data) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM user_favorite_vehicle WHERE id_user = ? LIMIT ? OFFSET ?', [data.idUser, data.limit, data.offset], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getAllFavorites = (data) => new Promise((resolve, reject) => {
  let extraQuery = '';
  if (data.idUser) {
    extraQuery += ` AND id_user=${data.idUser}`;
  }
  if (data.idVehicle) {
    extraQuery += ` AND id_vehicle=${data.idVehicle}`;
  }
  db.query(`SELECT * FROM user_favorite_vehicle WHERE 1=1 ${extraQuery} LIMIT ? OFFSET ?`, [data.limit, data.offset], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getCountData = (data) => new Promise((resolve, reject) => {
  let extraQuery = '';
  if (data.idUser) {
    extraQuery += ` AND id_user=${data.idUser}`;
  }
  if (data.idVehicle) {
    extraQuery += ` AND id_vehicle=${data.idVehicle}`;
  }
  db.query(`SELECT COUNT(*) rowsCount FROM user_favorite_vehicle WHERE 1 = 1 ${extraQuery}`, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.getUserFavoriteVehicle = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM user_favorite_vehicle WHERE id=?', id, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.checkUserFavoriteVehicle = (data) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM user_favorite_vehicle WHERE id_user = ? AND id_vehicle = ?', [data.idUser, data.idVehicle], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.addUserFavoriteVehicle = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO user_favorite_vehicle SET ?', data, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

exports.editUserFavoriteVehicle = (id, data) => new Promise((resolve, reject) => {
  db.query(
    'UPDATE user_favorite_vehicle SET ? WHERE id = ?',
    [data, id],
    (error, res) => {
      if (error) reject(error);
      resolve(res);
    },
  );
});

exports.deleteUserFavoriteVehicle = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM user_favorite_vehicle WHERE id = ?', [id], (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});
