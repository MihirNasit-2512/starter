var express = require("express");
var router = express.Router();
const authRouter = require("./auth");

router.get("/healthcheck", async (req, res) => {
  return res.status(200).send({ success: true, msg: "Server running." });
});

router.use("/auth", authRouter);

module.exports = router;
