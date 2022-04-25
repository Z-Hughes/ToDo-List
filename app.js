const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// Initiating express app
const app = express();

// Setting view engine to ejs
app.set("view engine", "ejs");

// body-parser to parse json data from post request
app.use(bodyParser.urlencoded({extended: true}));

// telling express where to find static files for css and images
app.use(express.static("public"));

//connecting and creating new db
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true});

//creating new mongoose schema
const itemSchema = new Schema ({name: String})

//creating new mongoose model
const Item = mongoose.model('Item', itemSchema)


//creating first three default items
const item1 = new Item({
  name: "Welcome to your ToDoList!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item2, item2, item3]

// Get and Post request:

app.get("/", function(req, res) {

  
  res.render("list", {
    listTitle: "Today",
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