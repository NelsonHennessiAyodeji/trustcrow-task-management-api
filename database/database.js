const { Client } = require("pg");

const connection = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

// Create the database automatically
function createTaskTable() {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS 
  tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL
  );`;

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error(err.message);
    }
  });
}

// DB Connection Logic
async function connectDB() {
  try {
    await connection.connect();
    // The prefix "\x1b[32m" and the suffix "\x1b[0m" simply ensures the text is printed in a green tint when i run
    // on the terminal, just to let anyone know that the prompts are expected and you're on the right path
    console.log(
      "\x1b[32mSuccessfully connected to DB, DB is ready for use \x1b[0m"
    );
    createTaskTable();
  } catch (error) {
    console.error("Database error, please fix");
    throw new Error(error.message);
  }
}

module.exports = { connection, connectDB };
