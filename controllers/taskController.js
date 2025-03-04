const { pool: query } = require("../database/database");
const { StatusCodes } = require("http-status-codes");

// Retrieve all tasks logic.
const getAllTasks = (req, res) => {
  // Query The Database to get all tasks.
  const allTasksQuery = `SELECT * FROM tasks;`;
  query.query(allTasksQuery, (err, result) => {
    const allTasks = result.rows;
    if (err) {
      console.error(err.message);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ "Error msg": err.message });
      return;
    } else {
      console.log(allTasks);
    }

    res.status(StatusCodes.OK).json(allTasks);
  });
};

// Retrieve a single task logic.
const getTask = (req, res) => {
  const { id } = req.params;
  if (!id || typeof Number.parseInt(id) !== "number") {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ "Error msg": "Please provide an ID for the task you want" });
    return;
  }

  // Query The Database to get a single task.
  try {
    const getTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
    query.query(getTaskQuery, [id], (err, result) => {
      let task;
      if (result !== undefined) {
        task = result.rows[0];
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ "Error msg": "The id should be of a whole number type" });
        return;
      }
      if (err) {
        console.error(err.message);
        res.status(StatusCodes.BAD_REQUEST).json({ "Error msg": err.message });
        return;
      } else if (!task) {
        res.status(StatusCodes.NOT_FOUND).json({
          "Error msg": `The task with the ID of ${id} does not exists`,
        });
        return;
      } else {
        console.log(task);
      }

      res.status(StatusCodes.OK).json(task);
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ "Error msg": `${error.message}` });
  }
};

// Create a new task logic.
const createTask = (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(StatusCodes.BAD_REQUEST).json({
      "Err msg": "Please fill the Title and Description field correctly",
    });
    return;
  }

  // Query The Database to create a new task.
  const createTaskQuery = `INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *;`;
  const taskData = [title, description];
  query.query(createTaskQuery, taskData, (err, result) => {
    const task = result.rows[0];
    if (err) {
      console.error(err.message);
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ "An Error occurred": err.message });
      return;
    } else {
      console.log(task);
    }

    res.status(StatusCodes.CREATED).json(task);
  });
};

// Update a task logic.
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!id) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ "Error msg": "Please provide an ID for the task you want" });
    return;
  } else if (!title || !description) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ "Err msg": "Please fill the Title and Description field" });
    return;
  }

  // Query The Database to update a task.
  const updateTaskQuery = `UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *;`;
  const taskData = [title, description, id];
  query.query(updateTaskQuery, taskData, (err, result) => {
    const task = result.rows[0];
    result.rows[0];
    if (err) {
      console.error(err.message);
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ "An Error occurred": err.message });
      return;
    } else if (result.rowCount === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        "Error msg": "The task youre trying to update does not exist",
      });
    } else {
      console.log(task);
    }

    res.status(StatusCodes.OK).json(task);
  });
};

// Delete a task.
const deleteTask = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ "Error msg": "Please provide an ID for the task you want" });
    return;
  }

  // Query The Database to delete a task.
  const deleteTaskQuery = `DELETE FROM tasks WHERE id = $1`;
  query.query(deleteTaskQuery, [id], (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ "An Error occurred": err.message });
      return;
    } else if (result.rowCount === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        "Error msg": "The task youre trying to delete does not exist",
      });
      return;
    } else {
      console.log(`The task With id of ${id} was deleted successfully`);
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: `The task With id of ${id} was deleted successfully` });
  });
};

module.exports = { getAllTasks, getTask, createTask, updateTask, deleteTask };
