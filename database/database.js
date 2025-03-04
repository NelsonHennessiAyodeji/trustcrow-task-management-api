const { Client, Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://the_nse:LDMCtqi0ck8oNGntCC5ev0XNHC6A8Dx7@dpg-cv3if7l2ng1s73816er0-a.oregon-postgres.render.com/mybase_wsm6",
  ssl: {
    rejectUnauthorized: false, // Required if Render enforces SSL
  },
});

const connection = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

// Create the task table automatically
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
    await pool.connect(); // Proper way to use `await`
    console.log("✅ Connected to Render PostgreSQL!");
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

module.exports = { connection, pool, connectDB };
