var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var people = require('./data/people');
var app = express();

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

var peopleCount = people.length;

app.get('/', function(req, res) {
  res.render('index')
});

app.get('/people', function(req, res) {
  console.log("GET From SERVER");
  res.render('people', {people: people});
});

app.post('/people', function(req, res) {
  if (!req.body.name || !req.body.city) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }
    peopleCount += 1
    var name = req.body.name;
    var city = req.body.city;
    var id = '' + (peopleCount);
    var newPerson = {name: name, favoriteCity: city, id: id};
    people.push(newPerson);
    res.redirect("/people")
});

app.get('/people/:id', function(req, res) {
  if(req.params.id < 0) {
  res.statusCode = 404;
  return res.send('Error 404: Not found');
  };
  var person = people.find(person => person.id === req.params.id);
  res.render('show', {person: person});
});

app.get('/people/:id/edit', function(req, res) {
  var person = people.find(person => person.id === req.params.id);
  res.render('edit', {person: person});
});

app.put('/people/:id', function(req, res) {
  if(req.params.id < 0) {
    res.statusCode = 404;
  return res.send('Error 404: Not found');
  };
  var person = people.find(person => person.id === req.params.id)
  var name = person.name;
  var city = req.body.city;
  var id = person.id;
  var editedPerson = { name: name, favoriteCity: city, id: id };
  var positionInArray = people.indexOf(person)
  people.splice(positionInArray, 1, editedPerson);
  res.redirect("/people");
});

app.delete('/people/:id', function(req, res) {
  // find the value you're looking for with the id
  var person = people.find(person => person.id === req.params.id);
  // // get the index of that value in people
  var positionInArray = people.indexOf(person)
  // // then remove it
  people.splice(positionInArray, 1);
  console.log(people);
  res.redirect('/people');
});

app.listen(3000, function(){
  console.log("it's RUNNING!");
});
