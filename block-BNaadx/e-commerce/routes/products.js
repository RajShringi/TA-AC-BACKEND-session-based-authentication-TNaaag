const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Comment = require("../models/Comment");
const User = require("../models/User");

router.get("/new", (req, res, next) => {
  if (req.session.adminId) {
    res.render("addProductForm");
  } else {
    res.redirect("/admins/login");
  }
});

router.post("/", (req, res, next) => {
  if (req.session.adminId) {
    Product.create(req.body, (err, product) => {
      if (err) return next(err);
      res.redirect("/products");
    });
  } else {
    res.redirect("/admins/login");
  }
});

router.get("/", (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    res.render("products", { products });
  });
});

router.get("/:product_id", (req, res, next) => {
  const product_id = req.params.product_id;
  Product.findById(product_id)
    .populate("comments")
    .exec((err, product) => {
      if (err) return next(err);
      res.render("productDetail", { product });
    });
});

router.get("/:product_id/edit", (req, res, next) => {
  if (req.session.adminId) {
    const product_id = req.params.product_id;
    Product.findById(product_id, (err, product) => {
      if (err) return next(err);
      res.render("editProductForm", { product });
    });
  } else {
    res.redirect("/admins/login");
  }
});

router.post("/:product_id", (req, res, next) => {
  const product_id = req.params.product_id;
  Product.findByIdAndUpdate(product_id, req.body, (err, updatedProduct) => {
    if (err) return next(err);
    res.redirect("/products/" + product_id);
  });
});

router.get("/:product_id/delete", (req, res, next) => {
  if (req.session.adminId) {
    const product_id = req.params.product_id;
    Product.findByIdAndDelete(product_id, (err, deletedProduct) => {
      if (err) return next(err);
      Comment.deleteMany({ productId: product_id }, (err, data) => {
        if (err) return next(err);
        deletedProduct.users.forEach((user_id) => {
          User.findByIdAndUpdate(
            user_id,
            { $pull: { cart: product_id } },
            (err, user) => {
              if (err) return next(err);
              console.log(user);
            }
          );
        });
      });
      res.redirect("/products/");
    });
  } else {
    res.redirect("/admins/login");
  }
});

router.get("/:product_id/like", (req, res, next) => {
  const product_id = req.params.product_id;
  console.log(req.session.userId);
  Product.findByIdAndUpdate(
    product_id,
    { $inc: { likes: 1 } },
    (err, product) => {
      if (err) return next(err);
      res.redirect("/products/" + product_id);
    }
  );
});

router.get("/:product_id/cart", (req, res, next) => {
  if (req.session.userId) {
    const product_id = req.params.product_id;
    console.log(req.session.userId);
    User.findByIdAndUpdate(
      req.session.userId,
      { $push: { cart: product_id } },
      (err, updatedUser) => {
        if (err) return next(err);
        Product.findByIdAndUpdate(
          product_id,
          { $push: { users: updatedUser.id } },
          (err, updatedProduct) => {
            if (err) return next(err);
            res.redirect(`/users/${req.session.userId}/cart`);
          }
        );
      }
    );
  } else {
    res.redirect("/users/login");
  }
});

router.post("/:product_id/comments", (req, res, next) => {
  const product_id = req.params.product_id;
  req.body.productId = product_id;
  req.body.author = req.session.userId;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Product.findByIdAndUpdate(
      product_id,
      { $push: { comments: comment.id } },
      (err, product) => {
        if (err) return next(err);
        res.redirect("/products/" + product_id);
      }
    );
  });
});

module.exports = router;
