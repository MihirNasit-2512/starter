const { LIST_TYPE } = require("../helper/constant");
const { checkRequired } = require("../helper/utils");
const Post = require("../model/post");
// const { default: mongoose } = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId
// new ObjectId("id")
exports.createPost = async (req, res) => {
  try {
    const requiredArr = ["title", "content", "author"];
    const missing = await checkRequired(requiredArr, req.body);
    if (missing?.length > 0) {
      return res.status(400).send({
        success: false,
        msg: "Required fields missing.",
        missing: missing,
      });
    }
    const {
      title,
      content,
      author,
      tags,
      categories,
      status,
      publishedDate,
      updatedDate,
      imageUrl,
      isFeatured,
      metaDescription,
      metaKeywords,
      isPublished,
      language,
      location,
    } = req.body;
    const { _id: userId } = req.user;
    const isExist = await Post.findOne({ title, authorId });
    if (isExist) {
      return res.status(400).send({
        success: false,
        msg: "Post already exist.",
      });
    }
    await Post.create({
      title,
      content,
      author,
      authorId: userId,
      tags,
      categories,
      status,
      publishedDate,
      updatedDate,
      imageUrl,
      isFeatured,
      metaDescription,
      metaKeywords,
      isPublished,
      language,
      location,
    });
    return res.status(201).send({
      success: true,
      msg: "Post created successful.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Something went wrong" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      postId = "",
      search = "",
      type = LIST_TYPE.DEFAULT,
    } = req.query;
    const { _id: userId } = req.user;
    const skip = (page - 1) * limit;
    let whereClause = {};
    if (postId) {
      whereClause["_id"] = postId;
    }
    if (search) {
      whereClause["title"] = { $regex: ".*" + search + ".*", $options: "i" };
    }
    if (type == LIST_TYPE.OWN) {
      whereClause["authorId"] = userId;
    } else if (type == LIST_TYPE.OTHER) {
      whereClause["authorId"] = { $ne: userId };
    }
    const postsList = await Post.find(whereClause).skip(skip).limit(limit);

    return res.status(200).send({
      success: true,
      data: postsList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Something went wrong" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { postId = "" } = req.params;
    const { _id: userId } = req.user;
    const updateFields = req.body;
    const isPostExist = await Post.find({ _id: postId, authorId: userId });
    if (!isPostExist) {
      return res.status(404).send({
        success: false,
        msg: "Post not found.",
      });
    }
    if (updateFields?.authorId) {
      delete updateFields?.authorId;
    }
    await Post.findByIdAndUpdate(
      postId,
      { $set: updateFields },
      { runValidators: true } // Return the updated document and run validators
    );
    return res.status(200).send({
      success: true,
      msg: "Post updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Something went wrong" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId = "" } = req.params;
    const { _id: userId } = req.user;
    const isPostExist = await Post.findOne({ _id: postId, authorId: userId });
    if (!isPostExist) {
      return res.status(404).send({
        success: false,
        msg: "Post not found.",
      });
    }

    await Post.findByIdAndUpdate(
      postId,
      { $set: { isDeleted: true } },
      { runValidators: true } 
    );
    return res.status(200).send({
      success: true,
      msg: "Post deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Something went wrong" });
  }
};
