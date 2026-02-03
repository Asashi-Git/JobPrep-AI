// index.js - Index route module.
const express = require("express");
const router = express.Router();

// Login page route.
router.get("/login", (req, res) => {
  res.send("Login");
});

// Register page route.
router.get("/register", (req, res) => {
  res.send("Register");
});

module.exports = router;