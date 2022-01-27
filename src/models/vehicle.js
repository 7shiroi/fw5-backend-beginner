const db = require('../helpers/db');

exports.getVehicles = (cb) => {
  db.query('SELECT * FROM vehicle', (error, res) => {
    if (error) {
      throw res.status(500).json({
        success: false,
        // query: q.sql,
        error,
      });
    }
    cb(res);
  });
};

exports.getVehicle = (id, cb) => {
  db.query('SELECT * FROM vehicle WHERE id=?', [id], (error, res) => {
    if (error) {
      throw res.status(500).json({
        success: false,
        // query: q.sql,
        error,
      });
    }
    cb(res);
  });
};

exports.addVehicle = (data, cb) => {
  db.query('INSERT INTO vehicle SET ?', data, (error, res) => {
    if (error) {
      throw res.status(500).json({
        success: false,
        // query: q.sql,
        error,
      });
    }
    cb(res);
  });
};

exports.editVehicle = (id, data, cb) => {
  db.query(
    // eslint-disable-next-line max-len
    'UPDATE vehicle SET name = ?, type = ?, merk = ?, stock = ?, price = ? WHERE id = ?',
    [data.name, data.type, data.merk, data.stock, data.price, id],
    (error, res) => {
      if (error) {
        throw res.status(500).json({
          success: false,
          // query: q.sql,
          error,
        });
      }
      cb(res);
    },
  );
};

exports.deleteVehicle = (id, cb) => {
  db.query('DELETE FROM vehicle WHERE id = ?', [id], (error, res) => {
    if (error) {
      throw res.status(500).json({
        success: false,
        //   query: query.sql,
        error,
      });
    }
    cb(res);
  });
};
