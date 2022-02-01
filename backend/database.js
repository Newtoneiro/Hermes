const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'Hermes',
    password: 'hermesdatabase',
    database: 'Hermes',
});