var mongoose = require("mongoose");

// Schema Campground
var commentSchema = new mongoose.Schema({
  author: String,
  text: String
});

module.exports = mongoose.model("Comment", commentSchema);
