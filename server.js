var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// var people = require('./data/people');
var app = express();
var Person = require("./models/person.js");
var mongoose = require('mongoose');

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});

app.set('port', process.env.PORT || 8080);

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// var peopleCount = people.length;

// ROUTES
app.get('/', function(req, res) {
  res.render('index')
});

app.get('/people', function(req, res) {
  console.log("GET From SERVER");
  Person.find({}, function(err, allPeople){
    if (err) {
      res.send(err)
    } else {
      res.render('people', {people: allPeople});
    }
  })
});

app.post('/people', function(req, res) {
  if (!req.body.name || !req.body.city) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }
    var name = req.body.name;
    var city = req.body.city;
    var newPerson = {name: name, favoriteCity: city};
    Person.create(newPerson, function(err, addPerson) {
      if (err) {
        res.send(err)
      } else {
        res.redirect('/people')
      }
    })
});

app.get('/people/:id', function(req, res) {
  if(req.params.id < 0) {
  res.statusCode = 404;
  return res.send('Error 404: Not found');
  };
  Person.findById(req.params.id, function(err, foundPerson){
    if (err) {
      res.send(err)
    } else {
      res.render('show', {person: foundPerson})
    }
  })
});

app.get('/people/:id/edit', function(req, res) {
  Person.findById(req.params.id, function(err, foundPerson){
    if (err) {
      res.send(err)
    } else {
      res.render('edit', {person: foundPerson});
    }
  })
});

app.put('/people/:id', function(req, res) {
  if(req.params.id < 0) {
    res.statusCode = 404;
  return res.send('Error 404: Not found');
  };
  var city = req.body.city;
  var editedPerson = { favoriteCity: city };
  Person.findByIdAndUpdate(req.params.id, editedPerson, function(err, updatePerson) {
    if (err) {
      res.send(err)
    } else {
      res.redirect("/people");
    }
  })
});

app.delete('/people/:id', function(req, res) {
  Person.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.send(err)
    } else {
      res.redirect('/people');
    }
  })
});

app.listen(app.get("port"), function(){
  console.log("Running the App");
});
