const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { type: String },
    likes: { type: Number, default: 0 },
    articleId: { type: Schema.Types.ObjectId, ref: "Article" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
