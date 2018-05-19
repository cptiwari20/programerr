const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const blogs = require('../models/blog');
var middleware = require("../middleware");

//get the comment page
// router.get("/blogs/:id/comment", middleware.isLoggedIn, (req, res, next)=> {
//   blogs.findById(req.params.id, function(err, blog) {
//     if(err) return err;
//       res.render('comments/new', {blog: blog, head: "Add a comment", subHead: "Share your opinions or thoughts."})
//   })
// });

router.post("/blogs/:id/comment", middleware.isLoggedIn, (req, res, next)=> {
  blogs.findById(req.params.id, function(err, blog) {
    if(err){
      console.log(err);
      res.redirect('/blogs')
    }else{
      var commentText = {commentText: req.body.commentText};
      Comment.create(commentText, function(err, comment){
         if(err){
             console.log(err);
             req.flash("error", "Something went wrong");
         } else {
             //add username and id to comment
             comment.author.id = req.user._id;
             comment.author.userName = req.user.username;
             // save comment
             comment.save();
             blog.comments.push(comment);
             blog.save();
             console.log(comment);
             req.flash('success', 'Created a comment!');
             res.redirect('/blogs/' + blog._id);
         }
      });
    }
  });
});
//edit comment
router.get("/blogs/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
     if(err){
         res.redirect("back");
     } else {
       res.render("comments/edit", { blog_id: req.params.id,
                                    comment: foundComment,
                                    head: "Editing Comment.",
                                    subHead: "Edit Your Comment."});
     }
  });
});
router.put('/blogs/:id/comments/:comment_id/edit',  middleware.checkCommentOwnership, function(req, res){
  var comment = {commentText: req.body.commentText }
  Comment.findByIdAndUpdate(req.params.comment_id, {$set: comment }, function(err, updatedComment){
     if(err){
          console.log(err);
         res.redirect("back");
     } else {
         res.redirect("/blogs/" + req.params.id );
         console.log(updatedComment);
     }
  });
});
//delete comment
router.delete("/blogs/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
     if(err){
          console.log(err);
         res.redirect("back");
     } else {
         req.flash("success", "Comment deleted");
         res.redirect("/blogs/" + req.params.id);
     }
  });
});


module.exports = router;
