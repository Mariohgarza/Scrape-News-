var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 3000;

var app = express();



app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// // mongoose.Promise = Promise;
// // mongoose.connect("mongodb://localhost/Scrape", {
// //   useMongoClient: true
// });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Scrape";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// var databaseUri ='mongodb://localhost/Scrape';
// if (process.env.MONGODB_URI) {
//   mongoose.connect(process.env.MONGODB_URI);
// } else {
//   mongoose.connect(databaseUri);
// }
// Routes

app.get("/Scrape", function(req, res) {
  console.log('pre scrape');

  axios.get("https://news.ycombinator.com/").then(function(response) {
    console.log(response);
    var $ = cheerio.load(response.data);
    $("td .title").each(function(i, element) {
      console.log(element);
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      console.log(result);
      db.Scrape.create(result)
        .then(function(dbScrape) {
          console.log('dbScrape', dbScrape);
        })
        .catch(function(err) {
          console.log('error', err);
          return res.json(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
  db.Scrape.find({})
    .then(function(dbScrape) {
      res.json(dbScrape);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Scrape.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbScrape) {
      res.json(dbScrape);
    })
    .catch(function(err) {

      res.json(err);
    });
});


app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {

      return db.Scrape.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbScrape) {

      res.json(dbScrape);
    })
    .catch(function(err) {

      res.json(err);
    });
});

app.get("/delete/:id", function(req, res) {

  db.Note.remove(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    function(error, removed) {

      if (error) {
        console.log(error);
        res.send(error);
      }
      else {

        console.log(removed);
        res.send(removed);
      }
    }
  );
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
