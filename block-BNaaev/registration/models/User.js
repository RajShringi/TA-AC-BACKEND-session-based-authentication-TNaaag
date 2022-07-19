const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlegth: 5 },
});

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashedString) => {
      if (err) return next(err);
      this.password = hashedString;
      return next();
    });
  } else {
    return next();
  }
});

module.exports = mongoose.model("User", userSchema);
