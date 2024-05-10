const express = require("express");
const userRoutes = express.Router();
const user = require("../controllers/user");

userRoutes.post("/create", user.createUser);

module.exports = userRoutes;
