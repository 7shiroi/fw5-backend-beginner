const { query, response } = require("express");
const e = require("express");
const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
  console.log("App running on port 5000");
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vehicle_rent",
});

app.get("/vehicle/:id?", (request, response) => {
  let q = "SELECT * FROM vehicle ";

  const { id } = request.params;
  if (id) {
    q += "where id=" + id;
  }

  connection.query(q, (error, results, fields) => {
    if (error)
      throw response.json({
        success: false,
        query: q,
        error: error,
      });

    if (results.length > 0) {
      return response.json({
        success: true,
        query: q,
        data: results,
      });
    } else {
      return response.json({
        success: false,
        query: q,
        message: "data not found",
      });
    }
  });
});

app.post("/vehicle/add", (request, response) => {
  const data = request.body;
  //expected body {name, type, merk, stock, price}

  const q = connection.query(
    "INSERT INTO vehicle SET ?",
    data,
    (error, results, fields) => {
      if (error)
        throw response.json({
          success: false,
          query: q.sql,
          error: error,
        });
      return response.json({
        success: true,
        query: q.sql,
        message: "1 row inserted",
      });
    }
  );
});

app.delete("/vehicle/:id", (request, response) => {
  const id = request.params.id;
  let q = "select * from vehicle where id = " + id;

  connection.query(q, (error, results, fields) => {
    if (error)
      throw response.json({
        success: false,
        query: q,
        error: error,
      });
    if (results.length > 0) {
      let query = "delete from vehicle where id = " + id;
      connection.query(query, (error, results, fields) => {
        if (error)
          throw response.json({
            success: false,
            query: query,
            error: error,
          });
        return response.json({
          success: true,
          query: query,
          message: "data with id " + id + " has been deleted",
        });
      });
    } else {
      return response.json({
        success: false,
        query: q,
        message: "data not found",
      });
    }
  });
});

app.patch("/vehicle/edit/:id", (request, response) => {
  const { id } = request.params;

  const q = "select * from vehicle where id = " + id;

  connection.query(q, (error, results, fields) => {
    if (error)
      throw response.json({
        success: false,
        query: q,
        error: error,
      });

    if (results.length > 0) {
      const data = request.body; //expected body {name, type, merk, stock, price}

      const query = connection.query(
        "UPDATE vehicle SET name = ?, type = ?, merk = ?, stock = ?, price = ? WHERE id = ?",
        [data.name, data.type, data.merk, data.stock, data.price, id],
        (error, results, fields) => {
          if (error)
            throw response.json({
              success: false,
              query: query.sql,
              error: error,
            });

          return response.json({
            success: true,
            query: query.sql,
            message: "data with id " + id + " has been edited",
          });
        }
      );
    } else {
      return response.json({
        success: false,
        query: q,
        message: "data not found",
      });
    }
  });
});
