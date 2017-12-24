// var dbconn = require("../data/dbconnection.js");
// var ObjectId = require("mongodb").ObjectId;
// var hotelData = require("../data/hotel-data.json");

var mongoose = require("mongoose");
var Hotel = mongoose.model("Hotel");

var runGeoQuery = function(req, res){
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	// A geoJSON point
	var point = {
		type : "Point",
		coordinates : [lng, lat]
	};

	var geoOptions = {
		spherical : true,
		maxDistance : 2000,
		num : 5
	};

	Hotel
		.geoNear(point, geoOptions, function(err, results, stats){
			if(err)
			{
				console.log("Error finding hotels");
				res
					.status(500)
					.json({ "message" : "Error finding hotels" });
			}
			else if(!results)
			{
				console.log("No hotels found close to specified latitude and longitude");
				res
					.status(404)
					.json({ "message" : "No hotels found close to specified latitude and longitude" });
			}
			else
			{
				console.log("Geo results", results);
				console.log("Geo stats", stats);
				res.json(results);
			}
		});

};

module.exports.hotelsGetAll = function(req, res){

	// var db = dbconn.get();
	// var collection = db.collection("hotels");

	console.log("Requested by " + req.user);
	var offset = 0;
	var count = 12;
	var maxCount = 20;

	if(req.query && req.query.lat && req.query.lng)
	{
		runGeoQuery(req, res);
		return;
	}

	if(req.query && req.query.offset)
	{
		offset = parseInt(req.query.offset, 10);
	}

	if(req.query && req.query.count)
	{
		count = parseInt(req.query.count, 10);
	}

	if(isNaN(offset) || isNaN(count))
	{
		res
			.status(400)
			.json({ "message" : "The supplied offset and count should be integers" });
		return;
	}

	if(count > maxCount)
	{
		res
			.status(400)
			.json({ "message" : "Maximum value of count can be " + maxCount });
		return;
	}

	/********** USING MONGOOSE *********/

	Hotel
		.find()
		.skip(offset)                          // skip function to set offset
		.limit(count)						   // limit function to set count
		.exec(function(err, hotels){
			if(err)
			{
				console.log("Error finding hotels");
				res
					.status(500)
					.json(err);
			}
			else
			{
				console.log("Found hotels", hotels.length);
				res.json(hotels);
			}
		});


	/********    USING MONGODB WITH NODE   *********/

	// collection
	// 	.find()
	// 	.skip(offset)                          // skip function to set offset
	// 	.limit(count)						   // limit function to set count
	// 	.toArray(function(err, docs){
	// 		if(err)
	// 		{
	// 			console.log("Error retrieving data from database");
	// 			return;
	// 		}
	// 		console.log("Found Hotels", docs);
	// 		res.json(docs);
	// 	});

	/**********************************************/


	/********* USING ONLY NODE ************/

	// console.log("db", db);

	// console.log("GET the hotels");
	// console.log(req.query);

	// var offset = 0;
	// var count = 5;

	// if(req.query && req.query.offset)
	// {
	// 	offset = parseInt(req.query.offset, 10);
	// }

	// if(req.query && req.query.count)
	// {
	// 	count = parseInt(req.query.count, 10);
	// }

	// var returnData = hotelData.slice(offset, offset + count);

	// //res.json(hotelData);

	// res.json(returnData);              // res.json() displays json on our webpage

	/************************************/
};

module.exports.hotelsGetOne = function(req, res){

	// var db = dbconn.get();
	// var collection = db.collection("hotels");

	var hotelId = req.params.hotelId;
	// var thisHotel = hotelData[hotelId];
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		.exec(function(err, doc){
			if(err)
			{
				console.log("Error finding hotels");
				res
					.status(500)
					.json(err);
			}
			else if(!doc)
			{
				res
					.status(404)
					.json({ "message" : "Hotel ID not found" });
			}
			else
			{
				res
					.status(200)
					.json(doc);
			}
		});

	// collection.findOne({ _id : ObjectId(hotelId) }, function(err, doc){
	// 		res.json(doc);
	// 	});
};


var _splitArray = function(input){
	var output;
	if(input && input.length > 0)
	{
		output = input.split(";");
	}
	else
	{
		output = [];
	}
	return output;
};


module.exports.hotelAddOne = function(req, res){

	Hotel
		.create({
			name : req.body.name,
			description : req.body.description,
			starts : parseInt(req.body.stars, 10),
			services : _splitArray(req.body.services),
			photos: _splitArray(req.body.photos),
			currenncy : req.body.currenncy,
			location : {
				address : req.body.address,
				coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
			}
		}, function(err, hotel){
			if(err)
			{
				console.log("Error creating hotel");
				res
					.status(400)
					.json(err);
			}
			else
			{
				console.log("Hotel created", hotel);
				res
					.status(201)
					.json(hotel);
			}
		});



	/*******  USING MONGODB WITH NODE  *******/
	// var db = dbconn.get();
	// var collection = db.collection("hotels");
	// var newHotel;

	// if(req.body && req.body.name && req.body.stars)
	// {
	// 	newHotel = req.body;
	// 	newHotel.stars = parseInt(req.body.stars, 10);
	// 	console.log("POST new Hotel");

	// 	collection.insertOne(newHotel, function(err, response){
	// 		console.log(response.ops[0]);              // req.body means body of the request sent to the server
	// 		res.json(response.ops[0]);
	// 	});
		
	// 	// res.json(newHotel);
	// }
	// else
	// {
	// 	console.log("Data missing from body");
	// 	res.json({ message : "Required data missing from body" });
	// }
};

module.exports.hotelsUpdateOne = function(req, res){

	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		.select("-reviews -rooms")
		.exec(function(err, doc){
			if(err)
			{
				console.log("Error finding hotels");
				res
					.status(500)
					.json(err);
			}
			else if(!doc)
			{
				res
					.status(404)
					.json({ "message" : "Hotel ID not found" });
			}
			else
			{
				doc.name = req.body.name;
				doc.description = req.body.description;
				doc.stars = parseInt(req.body.stars, 10);
				doc.services = _splitArray(req.body.services);
				doc.photos = _splitArray(req.body.photos);
				doc.currenncy = req.body.currenncy;
				doc.location = {
					address : req.body.address,
					coordinates : 
					[
						parseFloat(req.body.lng), 
						parseFloat(req.body.lat)
					]
				};

				doc.save(function(err, hotelUpdated){
					if(err)
					{
						console.log("Error updating the hotel", err);
						res
							.status(500)
							.json(err);
					}
					else
					{
						console.log("Hotel Updated", hotelUpdated);
						res
							.status(204)
							.json();
					}
				});

				// res
				// 	.status(200)
				// 	.json(doc);
			}
		});

};

module.exports.hotelsDeleteOne = function(req, res){

	var hotelId = req.params.hotelId;

	Hotel
		.findByIdAndRemove(hotelId)
		.exec(function(err, hotel){
			if(err)
			{
				console.log("Error deleting document");
				res
					.status(404)
					.json(err);
			}
			else
			{
				console.log("Hotel is deleted");
				res
					.status(204)
					.json();
			}
		});

};