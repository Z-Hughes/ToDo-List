const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

// Initiating express app
const app = express();

// Setting view engine to ejs
app.set("view engine", "ejs");

// body-parser to parse json data from post request
app.use(bodyParser.urlencoded({
  extended: true
}));

// telling express where to find static files for css and images
app.use(express.static("public"));

//connecting and creating new db
mongoose.connect('mongodb+srv://admin-zach:maynard@cluster0.dj2xp.mongodb.net/todolistDB', {
  useNewUrlParser: true
});

//creating new mongoose schema
const itemsSchema = {
  name: String
};

//creating new mongoose model
const Item = mongoose.model('Item', itemsSchema);


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

const defaultItems = [item1, item2, item3];

//creating new list Schema

const listSchema = {
  name: String,
  items: [itemsSchema]
};

//creating mongoose model

const List = mongoose.model('List', listSchema);



// Get and Post request:

app.get("/", function (req, res) {

  //If there are no items in the list then, insert default items and redirect
  Item.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.")
        }
        res.redirect("/");
      });
      
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});


//*******using express route paramaters to create dynamic express routes
//*******allows you to create new pages dynamically without defining get and post routes
//*******also creates new list documents dynamically within the call function
app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list", {
          listTitle: foundList.name, 
          newListItems: foundList.items
        });
      }
    }
  });
});


  app.post("/", function(req, res) {
    
      const itemName = req.body.newItem;
      const listName = req.body.list;
    
      const item = new Item({
        name: itemName
      });
    
      if (listName === "Today") {
        item.save();
        res.redirect("/");
      } else {
        List.findOne({
          name: listName
        }, function(err, foundList) {
          foundList.items.push(item);
          foundList.save(function(err, result){
          res.redirect("/" + listName);
        });
      });
      }
    });



    app.post("/delete", function(req, res){
      const checkedItemId = req.body.checkbox;
      const listName = req.body.listName;
    
      if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err){
          if (!err) {
            console.log("Successfully deleted checked item.");
            res.redirect("/");
          }
        });
      } else {
        List.findOneAndUpdate({
          name: listName
        }, {
          $pull: {
            items: {
              _id: checkedItemId
            }
          }
        }, function(err, foundList){
          if (!err){
            res.redirect("/" + listName);
          }
        });
      }
    });


app.get("/about", function (req, res) {
  res.render("about")
});

// setting server to listen on port 3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully");
});