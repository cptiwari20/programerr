const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require("passport")
var middleware = require("../middleware");
//Register
router.get('/register', (req, res)=>{
  res.render('user/register', {head:"Sign Up", subHead:"Register yourself as a new user. "});
});
router.post("/register", function(req, res){
    var firstName = req.body.firstName;
    var lastName  = req.body.lastName;
    var email     = req.body.email;
    var username  = req.body.username;
    var image  = req.body.image;
    var newUser = new User({email: email, firstName: firstName, lastName: lastName, image:image});
    newUser.save(function(err, user){
      if(err) console.log(err);
      console.log("user Saved!",user);
    });
    var usern = new User({username});
    User.register(usern, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
          console.log("sign up!!");
           req.flash("success", "Successfully Signed Up! Nice to meet you " + username);
           res.redirect("/blogs");
        });
    });
});

//Login
router.get('/login', (req, res) => {
  res.render('user/login', {head:"Log In", subHead:"Enter Your Email/ Mobile No. to login."});
});
// router.get((req, res, next) => {
//      if (req.user) res.redirect('/');
//      res.render('user/login', { message: req.flash('loginMessage')});
//    })
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: true
    }), function(req, res){
});
//facebok auth
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
 }));
 //google-passport

 router.get('/auth/google', passport.authenticate('google', { scope: 'email',  }));

 router.get('/auth/google/callback', passport.authenticate('google', {
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true
  }));

router.get('/user/:userId/account', (req, res)=>{
  User.findById(req.params.userId, (err, foundUser)=>{
    if(err){
      console.log(err);
    }else {

      res.render('user/account', {head:"Profile", subHead:"", user: foundUser})
    }
  })
})
router.get('/user/:id/edit', (req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{
    if(err){
      console.log(err);
    }else{
      console.log(foundUser);
      res.render('user/edit', {head: "Edit Your Profile", subHead:"Update Your info", user: foundUser})
    }
  })
})
//logout
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/");
});

module.exports = router;
