
const mysql = require('mysql2')
const { user, password } = require('../config/mysql_cred')

const db = mysql.createConnection({
    host: 'localhost',
    user,
    password,
    database: 'nodeJSIntegration'
})

db.connect(err => {
    if(err) return console.log(err);

    console.log('Connection to MySQL Database is established');
})

module.exports = db