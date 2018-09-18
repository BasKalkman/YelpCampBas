// MODULES
var express = require("express");
var app = express();
var ejs = require("ejs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// EXPRESS CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// MONGOOSE
mongoose.connect("mongodb://localhost/yelp_camp");
// Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Groningen",
//     image:
//       "https://www.photosforclass.com/download/pixabay-1163419?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104496f7c37daeecb3ba_960.jpg&user=Brahmsee",
//     description: "Nice campground in the north of the Netherlands"
//   },
//   function(err, newCampground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(newCampground);
//     }
//   }
// );

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
