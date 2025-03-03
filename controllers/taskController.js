const { connection: query } = require("../database/database");
const { StatusCodes } = require("http-status-codes");

// Uhhh
const getAllTasks = (req, res) => {
  const allTasksQuery = `SELECT * FROM tasks;`;
  query.query(allTasksQuery, (err, result) => {
    const allTasks = result.rows;
    if (err) {
      console.error(err.message);
      return;
    } else {
      console.log(allTasks);
    }
    res.status(StatusCodes.OK).json(allTasks);
  });
};

// Uhhh
const createTask = (req, res) => {
  const { title, description } = req.body;
  const createTaskQuery = `INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *;`;
  const taskData = [title, description];
  query.query(createTaskQuery, taskData, (err, result) => {
    const task = result.rows[0];
    if (err) {
      console.error(err.message);
      return;
    } else {
      console.log(task);
    }
    res.status(StatusCodes.CREATED).json(task);
  });
};

// Uhhh
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const updateTaskQuery = `UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *;`;
  const taskData = [title, description, id];
  query.query(updateTaskQuery, taskData, (err, result) => {
    const task = result.rows[0];
    if (err) {
      console.error(err.message);
    } else {
      console.log(task);
    }
    res.status(StatusCodes.OK).json(task);
  });
};

// Uhhh
const deleteTask = (req, res) => {
  const { id } = req.params;
  const deleteTaskQuery = `DELETE FROM tasks WHERE id = $1`;
  query.query(deleteTaskQuery, [id], (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Task With ${id} was successfully deleted`);
    }
    res
      .status(StatusCodes.NO_CONTENT)
      .json({ msg: `Task With ${id} was successfully deleted` });
  });
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
