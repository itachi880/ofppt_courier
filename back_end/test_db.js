require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2/promise");
console.log("############# env var #############");
if (process.env.DB_PASS != process.argv[2]) {
  process.env.DB_PASS = process.argv[2];
  // change th e db pass if exist;
  fs.writeFileSync(
    ".env",
    fs
      .readFileSync(".env", "utf8")
      .replace(/DB_PASS=.*/g, `DB_PASS=${newDBPass}`),
    "utf8"
  );
}
console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
console.log("############# connection test #############");
mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  })
  .then((res) => {
    res
      .query("SHOW DATABASES;")
      .then(console.log)
      .catch((err) => {
        console.log("error in db \n", err);
      });
  })
  .catch((err) => {
    console.log("error in db \n", err);
  });
