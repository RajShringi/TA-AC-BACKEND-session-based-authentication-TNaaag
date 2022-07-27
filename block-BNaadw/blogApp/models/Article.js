const mongoose = require("mongoose");
const slugger = require("slugger");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: String },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

articleSchema.pre("save", function (next) {
  this.slug = slugger(this.title);
  next();
});

module.exports = mongoose.model("Article", articleSchema);
