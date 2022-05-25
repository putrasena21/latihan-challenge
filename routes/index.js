const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome to the API",
  });
});

const routerUser = require("./user");
router.use("/user", routerUser);

const mediaRouter = require("./media");
router.use("/media", mediaRouter);

module.exports = router;
