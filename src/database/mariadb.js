const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let connection;
try{
  connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10
  });
}catch (err){
  console.log(err);
}

module.exports = connection;
