/********** FIRST PART ***********/

// require("./instantHello");

// //require("./talk/goodBye");  //USELESS LINE

// var goodBye1 = require("./talk/goodBye");
// goodBye1();

// var goodBye = require("./talk");
// goodBye.hello("Suyash");
// goodBye.intro();

// var question = require("./talk/question");
// var answer = question.ask("What is love?")
// console.log(answer);


/* *********** SECOND PART **********/

//console.log("Working");

/************ THIRD PART - EXPRESS ***********/

// require("./api/data/dbconnection.js").open();   // connects to the database, opens it
require("./api/data/db.js");                       // using mongoose
var express = require("express");
var app = express();
var path = require("path");

var routes = require("./api/routes");

var bodyParser = require("body-parser");

app.set("port", 3000);

// app.get("/", function(req, res){
// 	console.log("GET the homepage");
// 	res.send("Express yourself");
// });

/* EXPLORING MIDDLEWARE */

app.use(function(req, res, next){
	console.log(req.method, req.url);
	next();
});

/* FINISHED MIDDLEWARE PART */

//app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use(bodyParser.urlencoded({ extended : false }));    //req.body will not work without body-parser
app.use(bodyParser.json());

app.use("/api", routes);

// app.get("/", function(req, res){
// 	console.log("GET the homepage");
// 	res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.get("/json", function(req, res){
// 	console.log("GET the JSONs");
// 	res.json( {"jsonData" : true} );
// });

app.get("/file", function(req, res){
	console.log("GET the File");
	res.sendFile(path.join(__dirname, "app.js"));
});

var server = app.listen(app.get("port"), function(){
	var port = server.address().port;
	console.log("Magic happens on port " + port);
});

// app.listen(app.get("port")); //listen() is asynchronous method

// console.log("Magic happens on port " + app.get('port'));

