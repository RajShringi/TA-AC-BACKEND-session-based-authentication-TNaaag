var express = require("express");
var router = express.Router();
const User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, createdUser) => {
    console.log(createdUser);
    res.redirect("/users");
  });
});

module.exports = router;
