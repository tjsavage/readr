var mongoose = require('mongoose');

var server = require("./server");
var configDB = require('./config/database.js');

mongoose.connect(configDB.url);
server.start();