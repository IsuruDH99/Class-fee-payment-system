const express = require("express");
const router = express.Router();
const { Login } = require("../models");

router.post("/send", async (req, res) => {
  const login = req.body;
  await Login.create(login);
  res.json(login);
});

router.get("/login-data", async (req, res) => {
    const login = await Login.findAll();
    res.json(login);
  });

module.exports = router;
