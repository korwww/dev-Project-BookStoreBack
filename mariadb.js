const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'BookShop',
  dateStrings: true
});

module.exports = connection;

// const mysql = require('mysql2/promise');

// const db_info = {
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'BookShop',
//   multipleStatements: true,
//   dateStrings: true,
//   enableKeepAlive: true
// }

// module.exports = {
//   init: () => {
//       return mysql.createPool(db_info);
//   },
//   connect: (conn) => {
//       conn.connect(err => {
//           if (err) console.error('mysql connection error : ' + err);
//           else console.log('mysql is connected successfully!');
//       });
//   },
//   db_info
// }
