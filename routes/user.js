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
    // var firstName = req.body.firstName;
    // var lastName  = req.body.lastName;
    // var email     = req.body.email;
    var username  = req.body.username;
    // var newUser = new User({username: username, email: email, firstName: firstName, lastName: lastName});
    // newUser.save(function(err, user){
    //   if(err) console.log(err);
    //   console.log("user Saved!",user);
    // });
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
        failureFlash: true
    }), function(req, res){
});
//logout
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/");
});

module.exports = router;
