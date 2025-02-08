var express = require("express");
var router = express.Router();
const authRouter = require("./auth");
const postsRouter = require("./posts");

router.get("/healthcheck", async (req, res) => {
  return res.status(200).send({ success: true, msg: "Server running." });
});

router.use("/auth", authRouter);

router.use("/posts", postsRouter);

module.exports = router;
