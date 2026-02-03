const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;

// Functions
// Database: createPool() and testDatabaseConnection()
const { createPool, testDatabaseConnection } = require('./database/database.js');

// Routes
// index.js route
const index = require("./routes/index.js");
// users.js route
const users = require("./routes/users.js");

// Middlewares
app.use(cors());
app.use(express.json());

async function startApp(){
  // Function Calls
  await createPool();
  await testDatabaseConnection();

  // Routes
  // index.js route
  app.use("/", index);
  // users.js route
  app.use("/users", users);

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
  })
};

startApp();