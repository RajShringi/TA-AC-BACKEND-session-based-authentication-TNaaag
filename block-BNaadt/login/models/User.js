const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: { type: String, requried: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 4 },
});

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 12, (err, hashed) => {
      this.password = hashed;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

module.exports = mongoose.model("User", userSchema);
