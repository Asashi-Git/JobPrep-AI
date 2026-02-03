// index.js - Index route module.
const express = require("express");
const router = express.Router();

// Home page route.
router.get("/", (req, res) => {
  res.send("Welcome");
});

module.exports = router;