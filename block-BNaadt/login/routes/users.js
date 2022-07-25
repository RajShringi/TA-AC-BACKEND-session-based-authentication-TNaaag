var express = require("express");
var router = express.Router();
var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  var error = req.flash("error")[0];
  res.render("register", { error });
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (req.body.password.length < 4) {
        req.flash("error", `Password should be grether than 4 Letters`);
      } else {
        req.flash("error", `email is not unique`);
      }
      return res.redirect("/users/register");
    }
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res) => {
  var error = req.flash("error")[0];
  res.render("login", { error });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/Password requred");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    // user is null
    if (!user) {
      req.flash("error", "User is not register");
      return res.redirect("/users/login");
    }

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      // result is false
      if (!result) {
        req.flash("error", "Invalid Password");
        return res.redirect("/users/login");
      }
      // create session
      req.session.userId = user.id;
      res.redirect("/users");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});
module.exports = router;
