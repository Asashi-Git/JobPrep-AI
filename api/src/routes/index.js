// src/routes/index.js
import express from 'express';
export const routerIndex = express.Router();

// Home page route.
routerIndex.get("/", (req, res) => {
  res.send("Welcome");
});