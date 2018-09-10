var request = require('request');


module.exports = function(app) {


	app.get('/api/*', function(req, res) {
		var origin = req.originalUrl;
		nearbySearchUrl = 'https://maps.googleapis.com/maps' + origin + "&key=YOUR-API-KEY-HERE";
		 console.log( " nearbySearchUrl" +nearbySearchUrl); 
		request(nearbySearchUrl, function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			        // console.log(body); 
			        var json = JSON.parse(body);
			        res.send(json);// Print the google web page.

			     }
			})
		 
	});
	// app.get('/place/nearbysearch/*', function(req, res) {
	// 	var origin = req.originalUrl;
	// 	nearbySearchUrl = 'https://maps.googleapis.com/maps/api' + origin;
	// 	 console.log("next" +nearbySearchUrl); 
	// 	request(nearbySearchUrl, function (error, response, body) {
	// 		    if (!error && response.statusCode == 200) {
			    


	// 		        res.send(body);// Print the google web page.
	// 		     }
	// 		})
		 
	// });
	app.get('/details/*', function(req, res) {
		var origin = req.originalUrl;
		nearbySearchUrl = 'https://maps.googleapis.com/maps/api/place' + origin;
		 console.log("next" +nearbySearchUrl); 
		request(nearbySearchUrl, function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			    

			        res.send(body);// Print the google web page.
			     }
			})
		 
	});
	app.get('/yelpname/*', function(req, res) {
		console.log("yelpp me");
		var origin = req.originalUrl;
		yelp = 'https://api.yelp.com/v3/businesses/matches/best?' + origin.substring(10);
		 console.log("next" +yelp); 
		request({
			    headers: {
			      'Authorization':'Bearer 2gpbX20kqpEi_CtJGAUoMEdeTQL4bDcXS_MRRWAL8lPaHf-CgbKk7ugSeIrHng--9tBBTa94RNlJu3OjsjFvq4oXSvtpBdOPZiOtliVlEcac360YBdsmv1Gq6-6_WnYx'
			    },uri:yelp}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				
			        res.send(body);

			     }
			})
	});
	app.get('/businesses/*', function(req, res) {
		console.log("yelpp me reviews");
		var origin = req.originalUrl;
		yelp = 'https://api.yelp.com/v3' + origin;
		 console.log("next" +yelp); 
		request({
			    headers: {
			      'Authorization':'Bearer 2gpbX20kqpEi_CtJGAUoMEdeTQL4bDcXS_MRRWAL8lPaHf-CgbKk7ugSeIrHng--9tBBTa94RNlJu3OjsjFvq4oXSvtpBdOPZiOtliVlEcac360YBdsmv1Gq6-6_WnYx'
			    },uri:yelp}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// console.log(body);
			        res.send(body);// Print the google web page.

			     }
			})
	});
	app.get('/directions/*',function(req,res){

	console.log(" req.origin" +req.originalUrl);
		console.log(" req.destination"+req.query.destination);
		var url ="https://maps.googleapis.com/maps/api/directions/json?origin="+req.query.origin+"&destination="+req.query.destination+"&mode="+req.query.mode +"&key=AIzaSyDkE3ez-fPWeOcVI5jLs2lMdfvUhU9NU5A";
		console.log( " url" +url); 
		request(url, function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			        // console.log(body); 
			        var json = JSON.parse(body);
			        res.send(json);// Print the google web page.

			     }
			})
	

	});
	app.get('/getLatLong/*',function(req,res){

	console.log(" req.origin" +req.originalUrl);
		console.log(" req.destination"+req.query.destination);
		var url ="https://maps.googleapis.com/maps/api/directions/json?origin="+req.query.origin+"&destination="+req.query.destination+"&mode="+req.querymode +"&key=YOUR-API-KEY-HERE";
		console.log( " url" +url); 
		request(url, function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			        // console.log(body); 
			        var json = JSON.parse(body);
			        res.send(json);// Print the google web page.

			     }
			})
	

	});
	// app.get('/directions/fromLoc/*',function(req,res)){


	// });

	app.get('*', function(req, res) {

		// console.log("came inside get *");
		res.sendfile('./public/index.html'); 
	});
};
