const db = require("../helpers/db");

exports.getVehicles = (cb) => {
  db.query("SELECT * FROM vehicle", (err, res) => {
    if (err)
      throw response.status(500).json({
        success: false,
        // query: q.sql,
        error: error,
      });
    cb(res);
  });
};

exports.getVehicle = (id, cb) => {
  db.query("SELECT * FROM vehicle WHERE id=?", [id], (err, res) => {
    if (err)
      throw response.status(500).json({
        success: false,
        // query: q.sql,
        error: error,
      });
    cb(res);
  });
};

exports.addVehicle = (data, cb) => {
  db.query("INSERT INTO vehicle SET ?", data, (error, res) => {
    if (error)
      throw response.status(500).json({
        success: false,
        // query: q.sql,
        error: error,
      });
    cb(res);
  });
};

exports.editVehicle = (id, data, cb) => {
  const q = db.query(
    "UPDATE vehicle SET name = ?, type = ?, merk = ?, stock = ?, price = ? WHERE id = ?",
    [data.name, data.type, data.merk, data.stock, data.price, id],
    (error, res) => {
      if (error)
        throw response.status(500).json({
          success: false,
          // query: q.sql,
          error: error,
        });
      cb(res);
    }
  );
};

exports.deleteVehicle = (id, cb) => {
  db.query("DELETE FROM vehicle WHERE id = ?", [id], (error, res) => {
    if (error)
      throw response.status(500).json({
        success: false,
        //   query: query.sql,
        error: error,
      });
    cb(res);
  });
};
