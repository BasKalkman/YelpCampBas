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
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Groningen",
//     image: "https://pixabay.com/get/e136b60d2af51c22d2524518b7444795ea76e5d004b0144293f8c671a5eab3_340.jpg"
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
app.get("/campgrounds", (req, res) => {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", { campgrounds: allCampgrounds });
    }
  });
});

app.post("/campgrounds", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var newCamp = { name: name, image: image };
  Campground.create(newCamp, function(err, newCampground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
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
