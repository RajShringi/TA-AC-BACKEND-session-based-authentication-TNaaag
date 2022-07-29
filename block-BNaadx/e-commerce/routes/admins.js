var express = require("express");
var router = express.Router();
var Admin = require("../models/Admin");

/* GET admins listing. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  res.render("registerAdmin", { error: req.flash("error")[0] });
});

router.post("/register", (req, res, next) => {
  Admin.create(req.body, (err, admin) => {
    if (err) {
      if (err.code === 11000) {
        req.flash("error", "Email is already taken");
        return res.redirect("/admins/register");
      }
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        return res.redirect("/admins/register");
      }
      return next(err);
    }
    res.redirect("/admins/login");
  });
});

router.get("/login", (req, res) => {
  res.render("loginAdmin", { error: req.flash("error")[0] });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/Password required");
    return res.redirect("/admins/login");
  }
  Admin.findOne({ email }, (err, admin) => {
    if (err) return next(err);

    if (!admin) {
      req.flash("error", "admin is not register");
      return res.redirect("/admins/login");
    }

    admin.verifyPassword(password, (err, result) => {
      if (err) return next(err);

      if (!result) {
        req.flash("error", "Invalid Password");
        return res.redirect("/admins/login");
      }

      req.session.adminId = admin.id;
      res.redirect("/products/new");
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

module.exports = router;
