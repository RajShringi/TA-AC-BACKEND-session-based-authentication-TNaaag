const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  image: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  users: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

module.exports = mongoose.model("Product", productSchema);
