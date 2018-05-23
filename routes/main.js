const express = require('express');
const router = express.Router();

router.get("/", (req, res, next)=> {
  res.render('home', {head: "Welcome to Programerr", subHead:"Create, Share and Inspire!"})
});
router.get("/index", (req, res, next)=> {
  res.render('index')
});
router.get('/error', (req,res)=>{
  res.render('error', {head:"Page Not Found", subHead: "Go to Home Page"});
})

module.exports = router;
