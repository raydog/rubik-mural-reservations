var express = require('express');
var util = require('util');
var State = require('./state');

var our_state = new State("./_state_file.json");

var app = express();

app.set('views', './views')
app.set('view engine', 'jade');

// Parsing middleware:
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: false }));

// Actions:
app.post('/login', function (req, res) {
  if (!req.body || !req.body.name) {
    return res.redirect('/');
  }
  var name = req.body.name;
  util.log("Logged in as: " + name);
  res.cookie('name', name, { expires: 0, httpOnly: true });
  return res.redirect('/show');
});

app.post('/take', function (req, res) {
  if (!req.body || !req.body.task || !req.cookies || !req.cookies.name) {
    return res.send("Missing data.");
  }

  var name = req.cookies.name;
  var task = req.body.task;

  var msg = our_state.takeTask(task, name);
  util.log("Take task " + task + " by " + name + ": " + msg);

  return res.send(msg);
});

app.post('/complete', function (req, res) {
  if (!req.body || !req.body.task || !req.cookies || !req.cookies.name) {
    return res.send("Missing data.");
  }

  var name = req.cookies.name;
  var task = req.body.task;

  var msg = our_state.completeTask(task, name);
  util.log("Complete task " + task + " by " + name + ": " + msg);

  return res.send(msg);
});

app.post('/complete', function (req, res) {
  if (!req.body || !req.body.name) {
    return res.redirect('/');
  }
  var name = req.body.name;
  util.log("Logged in as: " + name);
  res.cookie('name', name, { expires: 0, httpOnly: true });
  return res.redirect('/show');
});


// Assets:
app.use("/static", express.static("static"))


// Pages:
app.get('/', function (req, res) {
  res.render('login');
});

app.get('/show', function (req, res) {
  if (!req.cookies || !req.cookies.name) {
    return res.redirect('/');
  }

  var username = String(req.cookies.name);

  res.render('show', {
    name:      username,
    allTasks:  our_state.getAllTasks(),
    userTasks: our_state.getUserTasks(username)
  });
});

app.listen(8123);
