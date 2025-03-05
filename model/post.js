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


// Middleware to auto-calculate points before saving
// categoriesProgressSchema.pre("save", function (next) {
//   this.points = this.categories.reduce(
//     (sum, category) => sum + (category.points || 0),
//     0
//   );
//   next();
// });


// Middleware to auto-calculate points when categories are pushed (on update)
// categoriesProgressSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();

//   // If categories are being pushed
//   if (update?.["$push"] && update?.["$push"]?.categories) {
//     // Get the existing document before update
//     const doc = await this.model.findOne(this.getQuery());

//     if (doc) {
//       // Calculate new points
//       const newCategory = update?.["$push"]?.categories;
//       const newTotalPoints = doc.points + (newCategory.points || 0);

//       // Set the new points value
//       this.set({ points: newTotalPoints });
//     }
//   }

//   next();
// });