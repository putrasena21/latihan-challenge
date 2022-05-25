const express = require("express");
const router = express.Router();

const authUser = require("../controllers/authUser.controller");
const userController = require("../controllers/user.controller");

router.post("/create", userController.createUser);

router.post("/login", authUser.login);

router.get("/auth/google", authUser.googleOAuth);

module.exports = router;
