const query = require("../database/database");
const { StatusCodes } = require("http-status-codes");

const getAllTasks = (req, res) => {
  const allTasksQuery = `SELECT * FROM tasks`;
  let allTasks;
  query.query(allTasksQuery, (err, res) => {
    if (err) {
      console.error(err.message);
    } else {
      allTasks = res.rows;
    }
  });
  res.status(StatusCodes.OK).send("allTasks");
};

module.exports = getAllTasks;
