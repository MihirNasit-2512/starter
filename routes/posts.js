var express = require("express");
var router = express.Router();
const postsController = require("../controller/postsController");
const verifyToken = require("../middleware.js/verifyToken");

router.post("/create-post", verifyToken, postsController.createPost);

router.get("/get-posts", verifyToken, postsController.getPosts);

router.patch("/update-post/:postId", verifyToken, postsController.updatePost);

router.delete("/delete-post/:postId", verifyToken, postsController.deletePost);

module.exports = router;
