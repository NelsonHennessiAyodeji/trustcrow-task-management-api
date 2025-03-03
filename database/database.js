const { Client } = require("pg");

const connection = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

// TODO: Create the database automatically

// DB Connection Logic
async function connectDB() {
  try {
    await connection.connect();
    console.log("Connected to DB");
  } catch (error) {
    console.error("Database error, please fix");
    throw new Error(error.message);
  }
}

module.exports = { connection, connectDB };
