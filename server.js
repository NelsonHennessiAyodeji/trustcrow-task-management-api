// General module imports
require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");

// API doc. Modules
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// Application Module imports
const { connection: query, connectDB, pool } = require("./database/database");
const taskRouter = require("./routers/taskRouter");

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

//_______________ Server Logic_________________//

// Quick overview of all tasks on the console.
function showCurrentTable() {
  query.query("Select * from tasks", (err, res) => {
    if (!err) {
      console.log(res.rows);
    } else {
      console.error(err.message);
    }
  });
}

// The server activation (The server will not run if the Database doesn't run properly first)
async function startServer() {
  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL
    );`;

    await connectDB();

    await pool.query(createTableQuery);
    console.log("✅ Tasks table checked/created successfully!");

    server.listen(port, () => {
      console.log(`\x1b[32mServer listening on port ${port} \x1b[0m`);
    });
    showCurrentTable();
  } catch (error) {
    throw new Error(error.message);
  }
}

startServer();
