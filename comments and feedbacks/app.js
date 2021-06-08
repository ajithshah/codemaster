const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const homeStartingContent = "Suggest your ideas and thoughts in the feedback section ";
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/codemaster_feedback", {useNewUrlParser: true});
const postSchema = {
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", { 
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});
app.get("/compose", function(req, res){
  res.render("compose");
});
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});
app.get("/posts/:postId", function(req, res){
const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});
app.listen(4000, function() {
  console.log("Server started on port 4000");
});
