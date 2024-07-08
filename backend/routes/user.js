const express = require("express");
const userRoutes = express.Router();
const user = require("../controllers/user");

userRoutes.post("/create", user.createUser);
userRoutes.post("/auth", user.userAuth);
userRoutes.post("/data", user.userData);

module.exports = userRoutes;
