const { connection: query } = require("../database/database");
const { StatusCodes } = require("http-status-codes");

const getAllTasks = (req, res) => {
  const allTasksQuery = `SELECT * FROM tasks;`;
  query.query(allTasksQuery, (err, response) => {
    let allTasks = response.rows;
    if (err) {
      console.error(err.message);
      return;
    } else {
      console.log(allTasks);
    }
    res.status(StatusCodes.OK).json(allTasks);
  });
};

const createTask = (req, res) => {
  const { title, description } = req.body;
  let task;
  const createTaskQuery = `INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *;`;
  const taskData = [title, description];
  query.query(createTaskQuery, taskData, (err, response) => {
    let task = response.rows[0];
    if (err) {
      console.error(err.message);
      return;
    } else {
      console.log(task);
    }
    res.status(StatusCodes.CREATED).json(task);
  });
};

module.exports = { getAllTasks, createTask };
