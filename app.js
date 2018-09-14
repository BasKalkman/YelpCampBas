// MODULES
var express = require("express");
var app = express();
var ejs = require("ejs");
var bodyParser = require("body-parser");

// EXPRESS CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extendend: true }));

// VARIABLES
var campgrounds = [
  {
    name: "Utrecht",
    image: "https://pixabay.com/get/e834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104496f6c97eafefb2be_340.jpg"
  },
  {
    name: "Groningen",
    image: "https://pixabay.com/get/e136b60d2af51c22d2524518b7444795ea76e5d004b0144293f8c671a5eab3_340.jpg"
  },
  {
    name: "Zeeland",
    image: "https://pixabay.com/get/e833b3092cf5033ed1584d05fb1d4e97e07ee3d21cac104496f6c97eafefb2be_340.jpg"
  }
];

// HOME
app.get("/", (req, res) => {
  res.render("landing");
});

// CAMPGROUNDS
app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", { campgrounds: campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.post("/campgrounds", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var newCamp = { name: name, image: image };
  campgrounds.push(newCamp);
  res.redirect("/campgrounds");
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
