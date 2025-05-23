const mysql = require("mysql2/promise");
require("dotenv").config(require("path").join(__dirname, "..", ".env"));
module.exports.db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  dateStrings: true,
});
