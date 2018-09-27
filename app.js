// MODULES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var seedDB = require('./seeds');
var passport = require('passport');
var localStrategy = require('passport-local');

// ROUTES IMPORTS
var campgroundsRoutes = require('./routes/campgrounds');
var commentsRoutes = require('./routes/comments');
var authRoutes = require('./routes/auth');

// MODELS
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

// EXPRESS CONFIG
app.set('view engine', 'ejs');
console.log(__dirname);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(express.static(__dirname + '/public'));

// PASSPORT CONFIG
app.use(
  require('express-session')({
    secret: 'Bas Test Express',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MONGOOSE
mongoose.connect(
  'mongodb://localhost/yelp_camp',
  { useNewUrlParser: true }
);

// SEED DB
seedDB();

// MIDDLEWARE
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// ROUTES
app.use(campgroundsRoutes);
app.use(commentsRoutes);
app.use(authRoutes);

// HOME
app.get('/', (req, res) => {
  res.render('landing');
});

// 404 ROUTE
app.get('*', (req, res) => {
  res.status(404);
  res.send('404 Not found');
});

// SERVER START
app.listen(process.env.PORT || 3000, function() {
  console.log('YelpCamp has started');
});
