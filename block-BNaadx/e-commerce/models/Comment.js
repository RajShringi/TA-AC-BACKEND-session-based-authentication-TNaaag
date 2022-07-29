const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
});

module.exports = mongoose.model("Comment", commentSchema);
