const db = require("../helpers/db");

exports.getVehicles = (cb) => {
  db.query("SELECT * FROM vehicle", (err, res) => {
    if (err)
      throw response.json({
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
      throw response.json({
        success: false,
        // query: q.sql,
        error: error,
      });
    cb(res);
  });
};

exports.addVehicle = (data, cb) => {
  db.query("INSERT INTO vehicle SET ?", data, (error) => {
    if (error)
      throw response.json({
        success: false,
        // query: q.sql,
        error: error,
      });
    cb();
  });
};

exports.editVehicle = (id, data, cb) => {
  db.query(
    "UPDATE vehicle SET name = ?, type = ?, merk = ?, stock = ?, price = ? WHERE id = ?",
    [data.name, data.type, data.merk, data.stock, data.price, id],
    (error) => {
      if (error)
        throw response.json({
          success: false,
          //   query: query.sql,
          error: error,
        });
      cb();
    }
  );
};

exports.deleteVehicle = (id, cb) => {
  db.query("DELETE FROM vehicle WHERE id = ?", [id], (error) => {
    if (error)
      throw response.json({
        success: false,
        //   query: query.sql,
        error: error,
      });
    cb();
  });
};
