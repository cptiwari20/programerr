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
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


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
//error handler;
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)
function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).render('error')
  } else {
    next(err)
  }
}
function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).render('error')
})

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
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//facebok-passport
passport.use(new FacebookStrategy({
  clientID: '192414354716135',
  clientSecret: '646446ac544cd2a3ad62d577f59fdc3a',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
}, function(accessToken, refreshToken, profile, next) {
    User.findOne({ facebookId: profile.id }, function(err, user) {
      if (user) {
        return next(err, user);
      } else {

        var newUser = new User();
        newUser.email = profile._json.email;
        newUser.facebookId = profile.id;
        newUser.username = profile.displayName;
        newUser.image = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
        newUser.save(function(err) {
          if (err) throw err;
          next(err, newUser);
        });
      }
    });
}));
//google-passport
passport.use(new GoogleStrategy({
  clientID: '503312610576-on5gta9kshpvst5elj1g0lai74ng11uc.apps.googleusercontent.com',
  clientSecret: 'AZqiDoHX26sazwz3WJw8MPYp',
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, function(accessToken, refreshToken, profile, next) {
    User.findOne({ googleId: profile.id }, function(err, user) {
      if (user) {
        return next(err, user);
      } else {
        var newUser = new User();
        newUser.email = profile.emails[0].value;
        newUser.googleId = profile.id;
        newUser.username = profile.displayName;
        newUser.user.firstName = profile._json.name.givenName;
        newUser.user.lastName = profile._json.name.familyName;
        newUser.image = profile._json.image.url;
        newUser.save(function(err) {
          if (err) throw err;
          next(err, newUser);
        });
      }
    });
}));

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
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    head: err.message,
    subHead: err
  });
});


app.listen(Port, (res, err)=> {
  if(err){
    console.log("Server Not Started", err);
    res.render('error')
  }console.log("Server has been Started i.e. " + Port);
})
