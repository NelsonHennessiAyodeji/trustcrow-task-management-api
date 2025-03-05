const CustomErrorAPI = require("./CustomErrorAPI");
const { StatusCodes } = require("http-status-codes");

class InternalServerError extends CustomErrorAPI {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
