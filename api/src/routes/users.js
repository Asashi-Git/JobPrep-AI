// src/routes/user.js
import express from 'express';
import { pool } from '../database/database.js';
export const routerUsers = express.Router();

// Login page route.
routerUsers.get("/login", (req, res) => {
  res.send("Login");
});

// Register page route.
routerUsers.get("/register", (req, res) => {
  res.send("Register");
  console.log(pool);
});