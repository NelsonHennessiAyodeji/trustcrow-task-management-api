// General module imports
const express = require("express");
const server = express();

// Application Module imports
const connection = require("./database/database");
const taskRouter = require("./routers/taskRouter");

// Whether this project's envionment is in production or development,
// the port will be adjusted accordingly.
const port = process.env.PORT || 8000;

//Middleware/Routers
server.use(taskRouter);

// A way to view the table as I run the software.
connection.query("Select * from tasks", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.error(err.message);
  }
});

// The server activation logic
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
