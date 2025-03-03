const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.post("/createTask", createTask);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);

module.exports = router;
