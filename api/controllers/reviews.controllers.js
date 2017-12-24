var mongoose = require("mongoose");
var Hotel = mongoose.model("Hotel");

module.exports.reviewsGetAll = function(req, res){
	var hotelId = req.params.hotelId;
	// var thisHotel = hotelData[hotelId];
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		.select("reviews")                   //.select("reviews") gives only the "reviews" of a document in 'doc'
		.exec(function(err, doc){
			if(err)
			{
				res
					.status(500)
					.json({ "message" : "Error finding hotel" });
			}
			else if(!doc)
			{
				res
					.status(404)
					.json({ "message" : "Reviews not found" });
			}
			else
			{
				console.log(doc);
				res
					.status(200)
					.json(doc.reviews);
			}
		});
};

module.exports.reviewsGetOne = function(req, res){
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("GET reviewId " + reviewId + "for hotelId " + hotelId);

	Hotel
		.findById(hotelId)
		.select("reviews")                   //.select("reviews") gives only the "reviews" of a document in 'doc'
		.exec(function(err, hotel){
			var review = hotel.reviews.id(reviewId);
			if(err)
			{
				res
					.status(500)
					.json({ "message" : "Error finding hotel" });
			}
			else if(!hotel)
			{
				res
					.status(404)
					.json({ "message" : "Review ID not found" });
			}
			else
			{
				console.log(hotel);
				res
					.status(200)
					.json(review);
			}
		});
};

var _addReview = function(req, res, hotel){

	hotel.reviews.push({                                 // We have to work on instance of model and not model itself, which is 'hotel' here. 
		name : req.body.name,
		rating : parseInt(req.body.rating, 10),
		review : req.body.review
	});

	hotel.save(function(err, hotelUpdated){              // instance of model should be saved
		if(err)
		{
			console.log("Error adding a review", err);
			res
				.status(500)
				.json(err);
		}
		else
		{
			console("Review added");
			res
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
		}
	});

};

module.exports.reviewsAddOne = function(req, res){

	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		.select("reviews")                   //.select("reviews") gives only the "reviews" of a document in 'doc'
		.exec(function(err, doc){
			if(err)
			{
				res
					.status(500)
					.json({ "message" : "Error finding hotel" });
			}
			else if(!doc)
			{
				res
					.status(404)
					.json({ "message" : "Reviews not found" });
			}
			else
			{
				if(doc)
				{
					_addReview(req, res, doc);
				}
				else
				{
					console.log(doc);
					res
						.status(200)
						.json(doc.reviews);
				}
			}
		});

};


/* THE REVIEWS INITIALLY DID NOT HAVE AN ID, SO WE NEEDED TO UPDATE THEM, GIVING AN ID. */

/*db.hotels.update(
	{},
	{
		$set : {
			"reviews.0._id" : ObjectId()
		}
	},
	{
		multi : true
	}
)*/

module.exports.reviewsUpdateOne = function(req, res){

	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;

	Hotel
		.findById(hotelId)
		.exec(function(err, doc){
			if(err)
			{
				console.log("Error finding hotel Id", err);
				res
					.status(500)
					.json(err);
			}
			else if(!doc)
			{
				console.log("Cannot find hotel");
				res
					.status(404)
					.json({ "message" : "Hotel could not be found" });
			}
			else
			{
				doc.reviews[0].name = req.body.name,
				doc.reviews[0].rating = parseInt(req.body.rating, 10),
				doc.reviews[0].review = req.body.review

				doc.save(function(err, reviewUpdated){
					if(err)
					{
						console.log("Error updating the review", err);
						res
							.status(500)
							.json(err);
					}
					else
					{
						console.log("Review Updated", reviewUpdated);
						res
							.status(204)
							.json();
					}
				});
			}
		});

};

module.exports.reviewsDeleteOne = function(req, res){

	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;

	Hotel
		.findById(hotelId)
		.exec(function(err, hotel){
			if(err)
			{
				console.log("Error finding hotel");
				res
					.status(500)
					.json(err);
			}
			else if(!hotel)
			{
				console.log("Hotel not found");
				res
					.status(404)
					.json({ "message" : "Hotel cannot be found" });
			}
			else
			{
				if(!reviewId)
				{
					console.log("Review not found");
					res
						.status(404)
						.json({ "message" : "Review cannot be found" });
				}
				else
				{
					hotel.reviews.id(reviewId).remove();              // remove() to be used to remove to sub documents

					hotel.save(function(err, doc){
						if(err)
						{
							console.log("Error saving hotel");
							res
								.status(500)
								.json(err);
						}
						else
						{
							console.log("Hotel saved");
							res
								.status(204)
								.json();
						}
					});
				}
			}
		});

};