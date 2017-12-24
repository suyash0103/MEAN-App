// angular.module("meanhotel").controller("HotelController", HotelController);

// function HotelController($http, $routeParams){
// 	var vm = this;
// 	var id = $routeParams.id;

// 	$http.get("/api/hotels/" + id).then(function(response){
// 		vm.hotel = response.data;
// 	});
// }


angular.module("meanhotel").controller("HotelController", HotelController);

function HotelController($route, $routeParams, hotelDataFactory, AuthFactory, jwtHelper, $window){
	var vm = this;
	var id = $routeParams.id;

	hotelDataFactory.hotelDisplay(id).then(function(response){
		vm.hotel = response;
		vm.stars = _getStarRating(response.stars);
	});

	function _getStarRating(stars){
		return new Array(stars);
	}

	vm.isLoggedIn = function(){
		if(AuthFactory.isLoggedIn)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	vm.isSubmitted = false;

	vm.addReview = function(){

		var token = jwtHelper.decodeToken($window.sessionStorage.token);
		var username = token.username;

		var postData = {
			name : username,
			rating : vm.rating,
			reviews : vm.review
		};

		if(vm.reviewForm.$valid)
		{
			hotelDataFactory.postReview(id, postData).then(function(response){
				if(response)
				{
					console.log("Added to database");
					vm.isSubmitted = false;
					$route.reload();
				}
				else
				{
					console.log("Response not found");
				}
			}).catch(function(error){
				console.log(error);
			});
		}
		else
		{
			vm.isSubmitted = true;
		}
	}
}