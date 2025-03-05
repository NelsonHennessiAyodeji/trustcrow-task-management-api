const { pool: query } = require("../database/database");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator");
const {
  NotFoundError,
  BadRequest,
  InternalServerError,
} = require("../errors/");

// Retrieve all tasks logic.
const getAllTasks = (req, res) => {
  // Query The Database to get all tasks.
  const allTasksQuery = `SELECT * FROM tasks;`;
  query.query(allTasksQuery, (err, result) => {
    const allTasks = result.rows;
    if (err) {
      throw new InternalServerError(err.message);
    }

    res.status(StatusCodes.OK).json(allTasks);
  });
};

// Retrieve a single task logic.
const getTask = (req, res, next) => {
  const { id } = req.params;
  if (!validator.isInt(id)) {
    next(
      new NotFoundError("Please provide a correct ID for the task you want")
    );
  }

  // Query The Database to get a single task.
  const getTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
  query.query(getTaskQuery, [id], (err, result) => {
    try {
      let task;
      if (result !== undefined) {
        task = result.rows[0];
      } else {
        throw new BadRequest("The id should be of a whole number type");
      }

      if (err) {
        throw new BadRequest(err.message);
      } else if (!task) {
        throw new NotFoundError(
          "The task with the ID of ${id} does not exists"
        );
      }

      res.status(StatusCodes.OK).json(task);
    } catch (error) {
      next(error);
    }
  });
};

// Create a new task logic.
const createTask = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    next(
      new BadRequest("Please fill the Title and Description field correctly")
    );
    return;
  }

  // Query The Database to create a new task.
  const createTaskQuery = `INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *;`;
  const taskData = [title, description];
  query.query(createTaskQuery, taskData, (err, result) => {
    try {
      const task = result.rows[0];
      if (err) {
        throw new BadRequest(err.message);
      }

      res.status(StatusCodes.CREATED).json(task);
    } catch (error) {
      next(error);
    }
  });
};

// Update a task logic.
const updateTask = (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!validator.isInt(id) || !id) {
    next(
      new NotFoundError("Please provide a correct ID for the task you want")
    );
    return;
  } else if (!title || !description) {
    next(new BadRequest("Please fill the Title and Description field"));
    return;
  }

  // Query The Database to update a task.
  const updateTaskQuery = `UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *;`;
  const taskData = [title, description, id];
  query.query(updateTaskQuery, taskData, (err, result) => {
    try {
      const task = result.rows[0];
      result.rows[0];
      if (err) {
        throw new NotFoundError(err.message);
      } else if (result.rowCount === 0) {
        throw new NotFoundError(
          "The task youre trying to update does not exist"
        );
      }

      res.status(StatusCodes.OK).json(task);
    } catch (error) {
      next(error);
    }
  });
};

// Delete a task.
const deleteTask = (req, res, next) => {
  const { id } = req.params;
  if (!validator.isInt(id)) {
    next(
      new NotFoundError("Please provide a correct ID for the task you want")
    );
  }

  // Query The Database to delete a task.
  const deleteTaskQuery = `DELETE FROM tasks WHERE id = $1`;
  query.query(deleteTaskQuery, [id], (err, result) => {
    try {
      if (err) {
        throw new BadRequest(err.message);
      } else if (result.rowCount === 0) {
        throw new NotFoundError(
          "The task youre trying to delete does not exist"
        );
      }

      res
        .status(StatusCodes.OK)
        .json({ msg: `The task With id of ${id} was deleted successfully` });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = { getAllTasks, getTask, createTask, updateTask, deleteTask };
