const mysql=require('mysql2/promise')
const cox= mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port:process.env.DB_PORT,
})
module.exports = cox;