const mysql=require('mysql2/promise')
const cox= mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ofppt_couriers',
})
module.exports = cox;