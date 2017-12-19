var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require('body-parser')
var http = require('http');
var port = 8080;
var app = express();
var mongoDB = 'mongodb://mongo/botifyDb';
mongoose.connect(mongoDB, {
    useMongoClient: true
});



var data = [{
    userName: "botify",
    password: "botifyPass",
    profile: "Trainer"
}, {
    userName: "botify2",
    password: "botifyPass2",
    profile: "User"
}];

require('./mongoCore.js')();

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



insert(data, function (err, docs) {
    console.log(docs);
    console.log(err);
});

app.post("/", function (req, res) {
    console.log("form redirected")
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    console.log(req.body);
    var userName = req.body.user.name;
    var userPassword = req.body.user.password;
    var userProfile = req.body.user.profile;

    selectOne({
        'username': userName,
        'password': userPassword
    }, function (err, doc) {
        if (err) {
            res.send("invalid user");
            console.log(err);
        } else
            console.log(doc);
        res.send("valid user");
    });

});

var server = http.createServer(app);
server.listen(port,
    function () {
        console.log("server started running at port 8080");
    });
