const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'SERVER',
    user: 'USER',
    database: 'DATABASE',
    password: 'PASSWORD',
});

module.exports = connection;
