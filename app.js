// MODULES
var express = require("express");
var app = express();
var ejs = require("ejs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var seedDB = require("./seeds");

// MODELS
var Campground = require("./models/campground");
var Comment = require("./models/comment");

// EXPRESS CONFIG
app.set("view engine", "ejs");
app.set(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE
mongoose.connect(
  "mongodb://localhost/yelp_camp",
  { useNewUrlParser: true }
);

seedDB();

// HOME
app.get("/", (req, res) => {
  res.render("landing");
});

// CAMPGROUNDS
// INDEX - Show campgrounds
app.get("/campgrounds", (req, res) => {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - Add campground
app.post("/campgrounds", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCamp = { name: name, image: image, description: description };
  Campground.create(newCamp, function(err, newCampground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW - Form for new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

// SHOW - Show info about one campground
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id, function(err, camp) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { camp: camp });
    }
  });
});

// 404 ROUTE
app.get("*", (req, res) => {
  res.status(404);
  res.send("404 Not found");
});

// SERVER START
app.listen(process.env.PORT || 3000, function() {
  console.log("YelpCamp has started");
});
