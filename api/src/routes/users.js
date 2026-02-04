// index.js - Index route module.
import express from 'express';
export const routerUsers = express.Router();

// Login page route.
routerUsers.get("/login", (req, res) => {
  res.send("Login");
});

// Register page route.
routerUsers.get("/register", (req, res) => {
  res.send("Register");
});