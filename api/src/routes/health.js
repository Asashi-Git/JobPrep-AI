// src/routes/health.js
import express from 'express';
export const routerHealth = express.Router();

// Health page route.
routerHealth.get("/health", (req, res) => {
  res.status(200).send("Ok!");
});