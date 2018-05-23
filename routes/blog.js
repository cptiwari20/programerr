const express = require('express');
const router = express.Router();
const Blogs = require('../models/blog');
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Render Pages  For Blogs
// New Page - add new Blog
router.get('/blogs/new', middleware.isLoggedIn, (req, res)=>{
  res.render('blogs/new', {head: "New Blog", subHead:"Add a new blog with title and Image."})
});
// All Blogs Index Page
router.get('/blogs', (req, res)=>{
  Blogs.find({}, (err, allBlogs)=>{
    if(err){
      console.log("Blogs Not Found");
    }else{
      res.render('blogs/index', {Blogs: allBlogs, head: "Blogs", subHead: "Learn and Share our blogs" })
    }
  })
});
// Show Blog- More info
router.get('/blogs/:id', (req, res)=>{
  //find the blog provided by id
  Blogs.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
    if(err) return err;
    Blogs.find({}, (err, allBlogs)=> {
      if(err){
        console.log(err)
      }else{
        res.render('blogs/show', {Blog: foundBlog, head: "Reading a Blog", subHead: foundBlog.title, Blogs:allBlogs});
      }
    });

  })
});


//Create /Aaa a new BLog
router.post('/blogs', middleware.isLoggedIn, (req, res)=>{
  var title = req.body.title;
  var body = req.body.body;
  var image = req.body.image;
  var category = req.body.category;
  var author = {
    id: req.user._id,
    username: req.user.username
}
  var newBlog = {title: title, body:body, image: image, author: author, category:category};
  //Create blog
  Blogs.create(newBlog, (err, newBlog)=>{
    if(err) return err;
    else {
      console.log("A New Blog is created.", newBlog);
      res.redirect('/blogs')
    }
  });
});
//update Get
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function(req, res){
    console.log("IN EDIT!");
    //find the campground with provided ID
    Blogs.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("blogs/edit", {blog: foundBlog, head: "Editing A Blog", subHead: foundBlog.title});
        }
    });
});
// Put
router.put("/blogs/:id",middleware.checkBlogOwnership, function(req, res){
    var newData = {title: req.body.title, image: req.body.image, body: req.body.body, category: req.body.category};
    Blogs.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, blog){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            console.log("blog Updated", newData);
            res.redirect("/blogs/" + blog._id);
        }
    });
});
// Delete a post
router.delete("/blogs/:id",middleware.checkBlogOwnership, function(req, res) {
  Blogs.findByIdAndRemove(req.params.id, (err, blog) =>{
    if(err) {
      console.log(err);
      res.redirect("back");
    }
    else{
    console.log("Blog deleted", blog)
    req.flash("success","Successfully Deleted!");
    res.redirect("/blogs")
  }
  })
})


module.exports = router;
