const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// Initiating express app
const app = express();

// Setting view engine to ejs
app.set("view engine", "ejs");

// body-parser to parse json data from post request
app.use(bodyParser.urlencoded({extended: true}));

// telling express where to find static files for css and images
app.use(express.static("public"));


// Arrays to hold the list items
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

// Get and Post request:

app.get("/", function(req, res) {

  let day = date.getDate();
  res.render("list", {
    listTitle: day,
    newListItems: items
  });

});

app.post("/", function(req, res) {

  let item = req.body.newItem;

  // checks to see which list the item was posted to
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  })
});

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function(req, res) {
  res.render("about")
});

// setting server to listen on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// Just random text to fix git commit