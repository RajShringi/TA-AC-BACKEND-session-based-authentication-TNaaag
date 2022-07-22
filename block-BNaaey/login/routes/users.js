var express = require("express");
var router = express.Router();
const User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, createdUser) => {
    if (err) return next(err);
    console.log(createdUser);
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
