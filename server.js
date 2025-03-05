// General module imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const server = express();
const cors = require("cors");

// API doc. Modules
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// Application Module imports
const { connectDB } = require("./database/database");
const taskRouter = require("./routers/taskRouter");
const errorHandler = require("./middleware/errorHandler");

// Whether this project's envionment is in production or development,
// the port will be adjusted accordingly.
const port = process.env.PORT || 8000;

// Middleware
server.use(cors());
server.use(express.json());

//Home Page/Route
server.get("/", (req, res) => {
  res.send(
    `<h1>Trustcrow Task Manager</h1><a href="/api-docs">Documentation</a>`
  );
});

//Routers
server.use("/api/v1/tasks", taskRouter);
server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Error Handler Middleware
server.use(errorHandler);

// The server activation (The server will not run if the Database doesn't run properly first)
async function startServer() {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`\x1b[32mServer listening on port ${port} \x1b[0m`);
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

startServer();
