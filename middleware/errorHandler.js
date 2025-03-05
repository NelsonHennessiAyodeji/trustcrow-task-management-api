const { CustomErrorAPI } = require("../errors");

const errorHandler = (err, req, res, next) => {
  try {
    if (err instanceof CustomErrorAPI) {
      return res.status(err.statusCode).json({ "Error msg": `${err.message}` });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = errorHandler;
