// angular.module("meanhotel").controller("HotelsController", HotelsController);

// function HotelsController($http)
// {
// 	var vm = this;
// 	vm.title = "MEAN Hotel App";

// 	$http.get("/api/hotels").then(function(response){    // We can also use ("/api/hotels&count=x") where we change the count value which we have set in backend
// 		console.log(response);
// 		vm.hotels = response.data;
// 	})

// }


angular.module("meanhotel").controller("HotelsController", HotelsController);

function HotelsController(hotelDataFactory)
{
	var vm = this;
	vm.title = "MEAN Hotel App";

	hotelDataFactory.hotelList().then(function(response){    // We can also use ("/api/hotels&count=x") where we change the count value which we have set in backend
		//console.log(response.data);
		vm.hotels = response;
	})

}