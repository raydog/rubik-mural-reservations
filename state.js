var fs = require('fs');
var util = require('util');


// Valid states for a task:
var STATE_AVAILABLE = "available";
var STATE_INPROG    = "inprog";
var STATE_DONE      = "done";


function RubikState(filename) {
  this.tasks = {};
  this.filename = filename
  this._initFromFile(filename) || this._initBrandNew();
}

RubikState.prototype._initBrandNew = function _initBrandNew() {
  var x, y;
  for (x=1; x<=20; x++) {
    for (y=1; y<=10; y++) {
      this.tasks[ "cube_"+x+"_"+y ] = STATE_AVAILABLE;
    }
  }
  util.log("Initialized from scratch.");
  this._trySave();
  return true
}

RubikState.prototype._initFromFile = function _initFromFile() {
  try {
    var data = fs.readFileSync(this.filename, {encoding: "utf8"});
    this.tasks = JSON.parse(data);
    util.log("Initialized from file.");
    return true;

  } catch (ex) {
    util.log("Failed to load prior state:", ex.stack || String(ex));
    return false;
  }
}

RubikState.prototype._trySave = function _trySave() {
  try {
    var data = JSON.stringify(this.tasks, null, 2);
    fs.writeFileSync(this.filename, data);
    util.log("Saved state to file.");
  } catch (ex) {
    util.log("Failed to save state to file: ", ex.stack || String(ex));
  }
}

RubikState.prototype.takeTask = function takeTask(task, username) {
  if (!this.tasks.hasOwnProperty(task)) { return "Bad task id"; }
  if (this.tasks[task] !== STATE_AVAILABLE) { return "Task not available"; }
  this.tasks[task] = STATE_INPROG + ":" + String(username);
  this._trySave();
  return "ok";
}

RubikState.prototype.completeTask = function completeTask(task, username) {
  if (!this.tasks.hasOwnProperty(task)) { return "Bad task id"; }
  if (this.tasks[task] !== STATE_INPROG + ":" + String(username)) { return "Could not complete task"; }
  this.tasks[task] = STATE_DONE;
  this._trySave();
  return "ok";
}

RubikState.prototype.getAllTasks = function getAllTasks() {
  return this.tasks;
}

RubikState.prototype.getUserTasks = function getUserTasks(username) {
  var self = this;
  var out = {};

  var wanted_state = STATE_INPROG + ":" + username;

  Object.keys(this.tasks)
    .filter(function (task) { return self.tasks[task] === wanted_state; })
    .forEach(function (task) { out[task] = wanted_state; });

  return out;
}

module.exports = RubikState;
