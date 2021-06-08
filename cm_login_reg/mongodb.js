const mongoose = require("mongoose");

var dbHost = '127.0.0.1';
var dbPort = '27017';
// var dbuser = ''; 
// var dbPassword = '';
var dbdatabase = 'codemaster';

const dbPath = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbdatabase;

mongoose.connect(dbPath, {
    useNewUrlParser: true, useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', function () {
    console.log("Mongoose default connection is open to ");
});

process.on('SIGINT', function () {
    db.close(function () {
        process.exit(0);
    });
});

module.exports = mongoose;