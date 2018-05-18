const express = require('express');
const router = express.Router();

router.get("/", (req, res, next)=> {
  res.render('home', {head: "Welcome to Programerr", subHead:"Create, Share and Inspire!"})
});
router.get("/index", (req, res, next)=> {
  res.render('index')
});
router.get('/account', (req, res)=>{
  res.render('user/account', {head:"My Portfolio", subHead:"coming soon!"})
})



module.exports = router;
