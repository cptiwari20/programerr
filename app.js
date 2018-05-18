const express        = require('express'),
      bodyParser     = require('body-parser'),
      ejs            = require('ejs'),
      mongoose       = require('mongoose'),
      config         = require('./config/secret'),
      methodOverride = require("method-override"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      session        = require("express-session"),
      User           = require("./models/user"),
      flash          = require("connect-flash"),
     nodemailer      = require('nodemailer');
// var   User           = require("./models/user")


var  app   = express(),
    Port   = 3000 || env.process.PORT;

//db connection
mongoose.connect(config.databases, function(err) {
	if(err){
		console.log(err);
	} console.log("Connected to Db");
});
mongoose.Promise = global.Promise;
//set
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//passport configuration (Authentication)
app.use(flash());
app.use(require("express-session")({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    // store: new mongoStore({url: config.database, autoReconnect: true})
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});





 //Routes
var mainRoutes = require('./routes/main.js');
var userRoutes = require('./routes/user.js');
var blogRoutes = require('./routes/blog');
var commentRoutes = require('./routes/comment');
app.use(mainRoutes);
app.use(userRoutes);
app.use(blogRoutes);
app.use(commentRoutes);

app.listen(Port, (res, err)=> {
  if(err){
    console.log("Server Not Started", err);
    res.render('error')
  }console.log("Server has been Started i.e. " + Port);
})
