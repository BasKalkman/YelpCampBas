// MODULES
var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var seedDB = require('./seeds');
var passport = require('passport');
var localStrategy = require('passport-local');

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

// HOME
app.get('/', (req, res) => {
  res.render('landing');
});

// CAMPGROUNDS
// INDEX - Show campgrounds
app.get('/campgrounds', (req, res) => {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - Add campground
app.post('/campgrounds', isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCamp = { name: name, image: image, description: description };
  Campground.create(newCamp, function(err, newCampground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// NEW - Form for new campground
app.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW - Show info about one campground
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, camp) {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { camp: camp });
      }
    });
});

// --------------------------
// COMMENTS ROUTES
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { camp: campground });
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

//--------------------------
// AUTH ROUTES
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/campgrounds');
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  function(req, res) {}
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
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
