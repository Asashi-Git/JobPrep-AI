const express = require('express');
const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

async function getSecret(secretName) {
  try {
    const secretPath = path.join('/run/secrets', secretName);
    const data = await fs.readFileSync(secretPath, 'utf8');
    return data
  } catch (error) {
    console.error(`Error while reading ${secretName}:`, error);
    return null;
  }
}

getSecret('db_user').then(data => console.log(data));
getSecret('db_password').then(data => console.log(data));

// async function connectDatabase {
//   const pool = mariadb.createPool({
//       host: 'mariadb', 
//       user: dbUser, 
//       password: dbPassword,
//       connectionLimit: 5
//   });
//   pool.getConnection()
//       .then(conn => {
      
//         conn.query("SELECT 1 as val")
//           .then((rows) => {
//             console.log(rows); //[ {val: 1}, meta: ... ]
//             //Table must have been created before 
//             // " CREATE TABLE myTable (id int, val varchar(255)) "
//             return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
//           })
//           .then((res) => {
//             console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
//             conn.end();
//             pool.end();
//           })
//           .catch(err => {
//             //handle error
//             console.log(err); 
//             conn.end();
//             pool.end();
//           })
          
//       }).catch(err => {
//         //not connected
//         pool.end();
//       });
// };

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`)
})