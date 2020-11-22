const auth = require("../middleware/auth");
const { Post, validateComments } = require("../models/post");
const { Comments, validate } = require("../models/comments");
const _ = require("lodash");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

/*
-----------------
Add New post
----------------
Method - POST
EndPoint - /api/post/new
Req Body - @title, @desc, @__user
*/
router.post("/new", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    post = new Post(_.pick(req.body, ["title", "desc", "_user"]));
    await post.save();
    res.send({ data: "added" });
  } catch (ex) {
    res.send(ex);
  }
 
});

/*
----------------------------
Get all post with comments
----------------------------
Method - GET
EndPoint - /api/post/

*/
router.get("/", auth, async (req, res) => {
  function getPost() {
    return Post.find().populate("_user").populate("_comments").exec();
  }
  try {
    const post = await getPost();
    if (!post) return res.status(404).send({ error: "no record" });
    res.send(post);
  } catch (ex) {
    res.send(ex);
  }
});

/*
-----------------------
Add comments to post
-----------------------
Method - POST
EndPoint - /api/post/newcommens/:id
Query Params - @id
Req Body - @comment, @__user
*/
router.post("/newcommens/:id", auth, async (req, res) => {
  const createComment = function (comment) {
    return Comments.create(comment).then((docComment) => {
      console.log("\n>> Created Comment:\n", docComment);
      return Post.findByIdAndUpdate(
        req.params.id,
        { $push: { _comments: docComment._id } },
        { new: true, useFindAndModify: false }
      );
    });
  };

  try {
    var comment = await createComment(req.body);
    if (!comment) return res.status(404).send({ error: "Error on comment" });
    res.send(comment);
  } catch (ex) {
    res.send(ex);
  }
  
});

module.exports = router;
