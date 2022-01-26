const vehicleModel = require("../models/vehicle");

const getVehicles = (req, res) => {
  vehicleModel.getVehicles((results) => {
    return res.json({
      success: true,
      message: "List Vehicles",
      results: results,
    });
  });
};

const getVehicle = (req, res) => {
  const { id } = req.params;
  vehicleModel.getVehicle(id, (results) => {
    if (results.length > 0) {
      return res.json({
        success: true,
        message: "Detail Vehicle",
        results: results[0],
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
  });
};

function validate_data_vehicle(data) {
  //expected data {name, type, merk, stock, price}
  const error = [];

  if (data.name == undefined || data.name.length == 0) {
    error.push("Input parameter nama salah!");
  }
  if (data.type == undefined || data.type.length == 0) {
    error.push("Input parameter type salah!");
  }
  if (data.merk == undefined || data.merk.length == 0) {
    error.push("Input parameter merk salah!");
  }
  if (
    data.stock == undefined ||
    data.stock.length == 0 ||
    typeof parseInt(data.stock) != "number"
  ) {
    error.push("Input parameter stock salah!");
  }
  if (
    data.price == undefined ||
    data.price.length == 0 ||
    typeof parseFloat(data.price) != "number"
  ) {
    error.push("Input parameter price salah!");
  }
  return error;
}

const addVehicle = (req, res) => {
  const data = req.body;
  //   expected body {name, type, merk, stock, price}
  const error = validate_data_vehicle(data);
  if (error.length > 0) {
    return res.json({
      success: false,
      error: error,
    });
  }

  vehicleModel.addVehicle(data, () => {
    return res.json({
      success: true,
      message: "1 vehicle added",
    });
  });
};

const editVehicle = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  //   expected body {name, type, merk, stock, price}
  const error = validate_data_vehicle(data);
  if (error.length > 0) {
    return res.json({
      success: false,
      error: error,
    });
  }

  vehicleModel.getVehicle(id, (results) => {
    if (results.length > 0) {
      vehicleModel.editVehicle(id, data, () => {
        return res.json({
          succes: true,
          message: "Vehicle with id " + id + " has been updated",
        });
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
  });
};

const deleteVehicle = (req, res) => {
  const { id } = req.params;

  vehicleModel.getVehicle(id, (results) => {
    if (results.length > 0) {
      vehicleModel.deleteVehicle(id, () => {
        return res.json({
          succes: true,
          message: "Vehicle with id " + id + " has been deleted",
        });
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
  });
};

module.exports = {
  getVehicles,
  getVehicle,
  addVehicle,
  editVehicle,
  deleteVehicle,
};
