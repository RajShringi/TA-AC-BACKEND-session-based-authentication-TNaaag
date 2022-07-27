const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const User = require("../models/User");

router.get("/new", (req, res, next) => {
  if (req.session.userId) {
    return res.render("articleForm");
  }
  res.redirect("/users/login");
});

router.post("/", (req, res, next) => {
  if (req.session.userId) {
    Article.create(req.body, (err, article) => {
      if (err) return next(err);
      res.redirect("/articles");
    });
  } else {
    res.redirect("/users/login");
  }
});

router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("articles", { articles });
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Article.findById(id)
    .populate("comments")
    .exec((err, article) => {
      res.render("articleDetail", { article });
    });
});

router.get("/:id/edit", (req, res, next) => {
  if (req.session.userId) {
    const id = req.params.id;
    Article.findById(id, (err, article) => {
      if (err) return next(err);
      res.render("articleEditForm", { article });
    });
  } else {
    res.redirect("/users/login");
  }
});

router.post("/:id", (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

router.get("/:id/delete", (req, res, next) => {
  if (req.session.userId) {
    const id = req.params.id;
    Article.findByIdAndDelete(id, (err, deletedArticle) => {
      if (err) return next(err);
      Comment.deleteMany({ articleId: id }, (err, data) => {
        if (err) return next(err);
        res.redirect("/articles");
      });
    });
  } else {
    res.redirect("/users/login");
  }
});

router.get("/:id/like", (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect("/articles/" + id);
    }
  );
});

router.post("/:id/comments", (req, res, next) => {
  const articleId = req.params.id;
  req.body.articleId = articleId;
  User.findById(req.session.userId, (err, user) => {
    if (err) return next(err);
    req.body.author = user.fullName();
    Comment.create(req.body, (err, comment) => {
      if (err) return next(err);
      Article.findByIdAndUpdate(
        articleId,
        { $push: { comments: comment.id } },
        (err, updatedArticle) => {
          if (err) return next(err);
          res.redirect("/articles/" + articleId);
        }
      );
    });
  });
});
module.exports = router;
