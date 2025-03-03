const { Client } = require("pg");

const connection = new Client({
  host: "localhost",
  user: "postgres",
  port: 8080,
  password: "1234",
  database: "taskDB",
});

// TODO: Create the database automatically

// TODO: Turn Syntax to Async-Await if necessary and implement No-db-failure-server run
connection
  .connect()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error(error.message);
  });

module.exports = connection;
