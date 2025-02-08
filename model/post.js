const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String }],
    categories: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedDate: { type: Date },
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        commentText: { type: String },
        createdDate: { type: Date, default: Date.now },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    imageUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    language: { type: String, default: "en" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre(["find", "findOne"], function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.models.Posts || mongoose.model("Posts", postSchema);
