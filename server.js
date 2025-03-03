// General module imports
require("dotenv").config();
const express = require("express");
const server = express();

// Application Module imports
const { connection: query, connectDB } = require("./database/database");
const taskRouter = require("./routers/taskRouter");

// Whether this project's envionment is in production or development,
// the port will be adjusted accordingly.
const port = process.env.PORT || 8000;

// Middleware
server.use(express.json());

//Routers
server.use("/api/v1/tasks", taskRouter);

//_______________ Server Logic_________________

// Quick overview of all tasks on the console.
query.query("Select * from tasks", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.error(err.message);
  }
});

// The server activation (The server will not run if the Database doesn't run properly first)
async function startServer() {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

startServer();
