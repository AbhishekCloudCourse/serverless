const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
  });


pool.on("connect", () => {
  console.log("connected to the db");
});

module.exports = {
  pool
};