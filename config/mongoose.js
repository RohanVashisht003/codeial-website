const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/codeial_development");
const db = mongoose.connection;

db.on('error', console.error.bind(console, "error connecting to mongodb"));

db.once('open', function(){
    console.log("Connected to mongodb");
});

module.exports = db;