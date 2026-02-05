// src/server.js
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Functions
// Database: createPool() and testDatabaseConnection()
// const { createPool, testDatabaseConnection } = require('./database/database.js');
import { createPool, testDatabaseConnection } from './database/database.js';

// Routes
// index.js route
import { routerIndex } from './routes/index.js';
// users.js route
import { routerUsers } from './routes/users.js';
// health.js route
import { routerHealth } from './routes/health.js';


// Middlewares
app.use(cors());
app.use(express.json());

async function startApp(){
  // Function Calls
  await createPool();
  await testDatabaseConnection();

  // Routes
  // index.js route
  app.use("/", routerIndex);
  // users.js route
  app.use("/users", routerUsers);
  // health.js route
  app.use("/", routerHealth);

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
  })
};

startApp();