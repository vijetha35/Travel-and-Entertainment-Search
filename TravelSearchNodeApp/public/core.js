var travelSearch = angular.module('travelsearch', ['ngAnimate']);

travelSearch.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);

    };
});

travelSearch.controller('mainController', function($scope, $http) {

	$scope.IsVisible = false;
	$scope.favPageNumber =1; 

	$scope.resultsTabClass ="active";
	$scope.favTabClass ="";
	$scope.lastTab ="";
	$scope.mapshow = true;
	$scope.disableGetDirections =false;
	$scope.resultsJson=[];
	$scope.currentPage=1;
	$scope.googleReviewsSelected=true;
	$scope.errorMessage="";
	$scope.isFavourites =false;
	$scope.favouritesList={};
	$scope.detailsDisabled= "checked";
	$scope.destinationLat="";
	$scope.destinationLong="";
	$scope.orderby ="";
	$scope.last_custom="";
	$scope.previousButton = false;
	$scope.nextButton = false;
	$scope.formControlKeyword = "";
	$scope.formControllocation = "";
    $scope.tableDisplay =false;
	$scope.disablecusloc =true;
	$scope.favourites=[];
	$scope.locrequired =false;
	$scope.onlyNumbers = /^\d+$/;
	$scope.disablesearch =true;
	$scope.reviewSelectedOption ="Google Reviews";
	$scope.orderSelectedOption ="Default Order";
	$scope.myLoc = "currentLoc";
	$scope.APIKey ="AIzaSyBDIaOeP0fVpdj3NiCOE-BfsZiIWn-rPoE";
	$scope.progressBarVisible =false;
	// console.log("entered the controller");
	

	$http.get("http://ip-api.com/json/")
    .success(function(response) {
    	// console.log( "response.data.lon" +JSON.stringify(response)+" \n" + response.lon+" " + response.lat);
        $scope.longitude = response.lon;
        $scope.latitude = response.lat;
        $scope.mycurrentlocation = response.as;
       
      
    })
    .error(function(data) {
				// console.log('Error loading Current Location: ' + data);
				$scope.errorMessage="Error retrieving the current location, Refresh Page and try again";
			});
    $scope.initializeFavorites=function()
    	{
    			$scope.favourites = angular.fromJson(localStorage.getItem('favourites'));
    			// console.log("favourites array" +JSON.stringify($scope.favourites));
    			$scope.favouritesList ={};
    			
			    if( $scope.favourites ==null)
			     {
			      		$scope.favourites= [];
			      		
			     }
			     // console.log("$scope.favourites.length "+$scope.favourites.length);
			     for(var i =0;i<$scope.favourites.length;i++)
			     {
			     	
			     		$scope.favouritesList[$scope.favourites[i].id] =true;

			     		// console.log(" here for fav"+$scope.favouritesList[$scope.favourites[i].id.replace(/['"]+/g, '')]);

			     }
			    //  console.log("$scope.favouritesList");
		   		// console.log($scope.favouritesList);
			     

    	};
    	$scope.initializeFavorites();
    	// console.log(" favourites list" + $scope.favouritesList);
	
	 $scope.searchEnable = function(){
		
		
			if( $scope.myLoc ==="currentLoc") //typeof $score.customplace ==== "undefined" || 
			{
				

				if( typeof $scope.longitude !=="undefined" && typeof $scope.latitude !=="undefined" && typeof $scope.keyword !=="undefined" && $scope.keyword.trim().length >0)
				{
					
						$scope.disablesearch = false;
				}
				else if(typeof $scope.keyword ==="undefined" ||$scope.keyword.trim().length ==0)
				{

					$scope.disablesearch = true;
				}
			}
			else if(  $scope.myLoc=="specLocation" )
			{
				if(typeof $scope.keyword !=="undefined" &&  $scope.keyword.trim().length >0  && typeof $scope.customplace !=="undefined" && $scope.customplace.trim().length>0) 
				{
					
					$scope.disablesearch=false;
				}
				else if(typeof $scope.customplace ==="undefined" || $scope.customplace.trim().length==0  || typeof $scope.keyword ==="undefined" ||  $scope.keyword.trim().length ==0)
				{
					// console.log("eee");
					
					$scope.disablesearch=true;
				}
			}
		};
	//$scope angular object passed by angular framework to controller, available in view, we use data binding to view
	// console.log("inside main controller");

	 $scope.formData = {};
	 $scope.keywordCheck = function(){

          if(typeof $scope.keyword === 'undefined'|| $scope.keyword.trim().length === 0   ){
             $scope.errorMsg = "Please enter a keyword.";
              $scope.formControlKeyword= "border:2px solid red;";
          }else{
             $scope.errorMsg = "";
             $scope.keyword=$scope.keyword;
              $scope.formControlKeyword= ""
           }
         };
     $scope.numbersOnly = function(){
      		
         
      };
	
      $scope.curLocation = function(){
     
      		$scope.disablecusloc =true;
      		$scope.locrequired =false;
      		$scope.errorMsgloc = "";
      		$scope.customplace="";
      		$scope.formControllocation="";
         
         };

	 $scope.otherLocation = function(){
	
	 
          $scope.disablecusloc=false;
          $scope.locrequired =true;
         };
       $scope.locationCheck = function(){

          if(typeof $scope.customplace === 'undefined'|| $scope.customplace.trim().length === 0   ){
             $scope.errorMsgloc = "Please enter a location";
             $scope.disablesearch=true;
             $scope.formControllocation="border:2px solid red;";
          }else{
             $scope.errorMsgloc = "";
             $scope.formControllocation="";
              $scope.customplace=$scope.customplace;
           }
         };

      $scope.searchPlaces = function(){
      	$scope.resultsJson=[' '];
  			
      		$scope.detailsDisabled="checked";
      		$scope.favPageNumber=1;
      		$scope.lastTab="results"
			$scope.progressBarVisible = true;
      		$scope.currentPage=1;
	     	$scope.errorMessage="";
	     	$scope.IsDetailsVisible =false;
     		$scope.isFavourites =false;
     		$scope.resultsTabClass="active";
     		$scope.favTabClass ="";
     	
     		$scope.initializeFavorites();
     		
     	
	      	if(typeof $scope.distance==='undefined')
	      	{
	      		$scope.distance=10;
	      	}
	      	else if(typeof $scope.distance==='string')
	      	{
	      		$scope.distance = parseInt($scope.distance.trim());
	      	}
	      	$scope.distMetres =$scope.distance *1609.344;

	      	if(typeof $scope.customplace!== 'undefined' && $scope.customplace.trim().length>0)
	      	{
	      		console.log("$scope.customplace"+$scope.customplace + " custom place" +JSON.stringify(place_custom));
	      		if( typeof(place_custom) !== "undefined" && "formatted_address" in place_custom && place_custom.formatted_address.trim().length >0)
	      		{
	      			$scope.customplace=place_custom.formatted_address.trim();
	      			// console.log($scope.customplace);
	      		}
	      		
	      		var customURL ='https://maps.googleapis.com/maps/api/geocode/json?address='+ encodeURIComponent($scope.customplace.trim()) + '&key=' + $scope.APIKey;

	      		$http.get(customURL)
	   			 .success(function(response) {
	   			 	
	   			 	 
			       $scope.customLong = response.results[0].geometry.location.lng;
			         $scope.customLat = response.results[0].geometry.location.lat;
			         $scope.fromAddressForRoute= $scope.customplace.trim();

			          var placesURl = '/api/place/nearbysearch/json?location='+$scope.customLat+','+$scope.customLong+'&radius='+$scope.distMetres+'&type='+encodeURIComponent($scope.category)+'&keyword='+encodeURIComponent($scope.keyword);
	   			 		// console.log(" url : https://maps.googleapis.com/maps"+ placesURl);
	   			  		$http.get(placesURl)
	   			 		.success(function(res) {
	   			 			// console.log("res "  +" \n" +JSON.stringify(res.results) );
	   			 			$scope.progressBarVisible=false;
	   			 		if(res.status!= "ZERO_RESULTS")
	   			 		{
	   			 		$scope.resultsJson[$scope.currentPage]= res.results;
	   			 		
			   			 		for(var j =0;j<res.results.length;j++)
			   			 		{
			   			 			if( $scope.favouritesList[res.results[j].place_id] ==undefined)
			   			 			// if( $scope.favouritesList.indexOf(res.results[j].place_id)==-1)
			   			 			{
			   			 				$scope.favouritesList[res.results[j].place_id] =false;
			   			 			}
			   			 			else
			   			 			{
			   			 				$scope.favouritesList[res.results[j].place_id]=true;

			   			 			}
			   			 		} 
	   			 		}
	   			 		else
	   			 		{
	   			 		$scope.resultsJson=[];
	   			 		
	   			 		}
	   			 		$scope.nextPage = res.next_page_token;
	   			 		if( "next_page_token" in res )
	   			 		{
	   			 			$scope.nextButton ="true";
	   			 		}
	   			 		else
		   			 	{
		   			 		$scope.nextButton ="false";

		   			 	}



	   			 		
			    		}).error(function(data) {
							// console.log('Error obtaining results for the search ' + data);
							$scope.progressBarVisible=false;
							$scope.errorMessage="Error obtaining results for the search";
						});


			    })
	   			 .error(function(error) {
							// console.log('Error locating other address ' +error);
							$scope.errorMessage="Error locating other address";
							$scope.progressBarVisible=false;
						});


			    

	   		
	      	}
	      	else
	      	{
	      		 var placesURl = '/api/place/nearbysearch/json?location='+$scope.latitude+','+$scope.longitude+'&radius='+$scope.distMetres+'&type='+encodeURIComponent($scope.category)+'&keyword='+encodeURIComponent($scope.keyword);
	   			 $http.get(placesURl)
	   			 .success(function(res) {
	   			 	$scope.fromAddressForRoute="Your Location";
	   			 	$scope.progressBarVisible=false;
	   			 	// console.log(" response from palces" + JSON.stringify(res));
	   			 	if(res.status!= "ZERO_RESULTS")
	   			 	{
	   			 		$scope.resultsJson[$scope.currentPage]= res.results;
	   			 		
	   			 	}
	   			 	else
	   			 	{
	   			 		$scope.resultsJson=[];
	   			 		
	   			 	}
	   			 	$scope.nextPage = res.next_page_token;
	   			 	if( "next_page_token" in res )
	   			 		{
	   			 			$scope.nextButton ="true";
	   			 		}
	   			 	else
	   			 	{
	   			 		$scope.nextButton ="false";

	   			 	}

	      	}).error(function(data) {
							console.log('Error obtaining results for the search ' + data);
							$scope.errorMessage="Error obtaining results for the search";
							$scope.progressBarVisible=false;
						});

	      }

		
	 	
	 		     $scope.IsVisible = true;


	     
      };
      $scope.displayFavourites = function(){
      	$scope.resultsTabClass ="";
     		$scope.favTabClass="active";
      	$scope.IsVisible = false;
      	$scope.isFavourites = true;
      	$scope.IsDetailsVisible =false;
      	$scope.lastTab="favourites";
      	
      	$scope.favourites = angular.fromJson(localStorage.getItem('favourites'));

      	if( $scope.favourites ==null)
      	{
      		$scope.favourites= [];
      	}
      	$scope.favPagination();
      	
      		
      	
      };
      $scope.nextFavResults =function()
      {
      	
      	 $scope.favPageNumber = $scope.favPageNumber + 1;
    	$scope.favPagination();
      };
      $scope.prevFav= function(){
		    $scope.favPageNumber = $scope.favPageNumber - 1;
		    $scope.favPagination();
  	};
      $scope.favPagination = function(){
    		$scope.favPaginationTableRes = [];
		    for(var i = ($scope.favPageNumber-1)*20; (i < $scope.favPageNumber*20) && (i < $scope.favourites.length); i++) {
		      $scope.favPaginationTableRes.push($scope.favourites[i]);
		    }
		   

		    if($scope.favourites.length > $scope.favPageNumber*20)
		    {
		      $scope.nextFavButton = true;
		    } else 
		    {
		      $scope.nextFavButton = false;
		    }
		     if($scope.favPageNumber == 1){
		      $scope.previousFavButton = false;
		    } else 
		    {
		      $scope.previousFavButton = true;
		    }
		    if($scope.favPaginationTableRes.length <1)
		    {
		    	$scope.prevFav();
		    }
		    
	};
      $scope.checkInFavourites = function(row,index){

      			// console.log("row " +index);
      			$scope.favourites = angular.fromJson(localStorage.getItem('favourites'));
      			if( $scope.favourites ==null)
		      	{
		      		$scope.favourites= [];
		      	}
			    
			  return $scope.favourites.indexOf(row)>=0;
			   	


      };

      $scope.saveToFavourites = function(saveRow){
      

      	var row = {'icon': saveRow.icon, 'vicinity': saveRow.vicinity,'name':saveRow.name , 'id': saveRow.place_id};
      		// console.log(" favourites save" +row.id);
      	

      
      	$scope.favourites = angular.fromJson(localStorage.getItem('favourites'));
      	
      	if( $scope.favourites ==null)
      	{
      		$scope.favourites= [];
      	}
      	found =false;
      	for(var i = 0; i < $scope.favourites.length; i++) {
    			if ($scope.favourites[i].id == row.id) {
        			found = true;
				        break;
				    }
		}
      
      	if (found == false)
      	{
      		
      		$scope.favourites.push(row);
      		localStorage.setItem('favourites',angular.toJson( $scope.favourites));
		      		if ($scope.favouritesList[row.id]==undefined || $scope.favouritesList[row.id]==false)
		      	// if( $scope.favouritesList.indexOf(row.id)==-1)
		      	{
		      		$scope.favouritesList[row.id] = true;
		      	}
      	}
      	else
      	{
      		
      		$scope.deleteFavourites(row);
      		$scope.favourites[row.id] = false;
      		$scope.favouritesList[row.id]=false;
      		
      		
      	}
      	$scope.favPagination();

      	

      };
      $scope.deleteFavourites= function(row){

      
      	$scope.favourites = angular.fromJson(localStorage.getItem('favourites'));
      	$scope.favouritesList[row.id]=false;
      
      	if( $scope.favourites ==null)
      	{
      		$scope.favourites= [];
      	}
      	found =false;
      	index=0;
      	for(var i = 0; i < $scope.favourites.length; i++) {
    			if ($scope.favourites[i].id == row.id) {
		        			found = true;
		        			index= i;
		        			break;
				    }
				  
				  
		}
      	if(found ==true)
      	{
      		$scope.favourites.splice(index, 1);
      	
      		localStorage.setItem('favourites',angular.toJson( $scope.favourites));
      	}
      	$scope.favPagination();
      
      	


      };

      $scope.displayResults = function () {
               
               	$scope.lastTab="results";
               	$scope.resultsTabClass ="active";
     			$scope.favTabClass="";
              
                	$scope.IsVisible = true;
                	$scope.IsDetailsVisible =false;
             
                $scope.isFavourites =false;
       };

       $scope.previousResults =function(){

       		$scope.currentPage=$scope.currentPage-1;
       		if($scope.currentPage<$scope.resultsJson.length)
       			$scope.nextButton =true;
       		else
       			$scope.nextButton=false;
       		$scope.errorMessage="";
       };

       $scope.nextResults =function(){


       		$scope.previousButton =true;
       		$scope.currentPage=$scope.currentPage+1;

       			
       		if(typeof $scope.resultsJson[$scope.currentPage]==='undefined' && typeof $scope.nextPage !=='undefined')
       		{
       				$scope.progressBarVisible =true;
		 			var placesURl = "/api/place/nearbysearch/json?pagetoken="+ $scope.nextPage ;
		 			// console.log("next results" + placesURl); 
			   			 $http.get(placesURl)
			   			 .success(function(res) {
			   			 	// console.log(" response from next" + JSON.stringify(res));
			   			 	$scope.progressBarVisible=false;
			   			 	$scope.resultsJson[$scope.currentPage] = res.results;
			   			 	for(var j =0;j<res.results.length;j++)
			   			 		{
			   			 			if($scope.favouritesList[res.results[j].place_id]==undefined)
			   			 			// if( $scope.favouritesList.indexOf(res.results[j].place_id)==-1)
			   			 			{
			   			 				$scope.favouritesList[res.results[j].place_id] =false;
			   			 			}
			   			 			else
			   			 			{
			   			 				$scope.favouritesList[res.results[j].place_id]=true;

			   			 			}
			   			 		} 
			   			 	$scope.nextPage =res.next_page_token;
			   			 	if( "next_page_token" in res )
			   			 		{
			   			 			$scope.nextButton =true;
			   			 		}
			   			 	else
			   			 	{
			   			 		$scope.nextButton =false;
			   			 	}
			      	}).error(function(data) {
									// console.log('Error obtaining results for the next ' + data);
									$scope.errorMessage="Error obtaining results for the next page ";
									$scope.nextButton =false;
								});

			    }
			    else if(typeof $scope.nextPage ==='undefined')
			    {

			    	// console.log("hereee" + $scope.currentPage + " " + $scope.resultsJson.length);
			    		if($scope.currentPage+1 <$scope.resultsJson.length)
			    		{
			    			$scope.nextButtonx=true;
			    		}
			    		else
			    		{
			    			$scope.nextButton=false;
			    		}
			    }

       };
       $scope.enableDetails =function()
      {
      	
      	$scope.detailsDisabled = "";
      	
      };
      $scope.onClickDetails = function()
      {

      	$scope.IsVisible = false;
      	$scope.isFavourites =false;
     	$scope.IsDetailsVisible =true;
      };
        
       $scope.placesInfo= function(element,lati,long)
      {
      		// fromRoute={};
      		// place_custom={};
      		$scope.IsDetailsVisible= true;

      		$scope.yelpReviews=[];
      		$scope.IsVisible= false;
      		$scope.isFavourites= false;
      		$scope.nextButton= false;
      		$scope.previousButton=false;
      		$scope.destinationLat=lati;
      		$scope.destinationLon =long;
            placeid  = element.currentTarget.getAttribute('data-placeid');
		             var request = {
		              placeId: placeid
		            };
            		var map = new google.maps.Map(document.getElementById('map'), {
			         center: {lat:parseFloat(lati), lng:  parseFloat(long)},
			          zoom: 15
			        });
			         marker = new google.maps.Marker({
			         
			          position: {lat:  parseFloat(lati), lng:  parseFloat(long)},
			          map: map
			        });
			         directionsDisplay = new google.maps.DirectionsRenderer;
			          directionsDisplay.setMap(map);
			          directionsDisplay.setPanel(document.getElementById('directionsPanel'));
			          directionsService = new google.maps.DirectionsService;
			          service = new google.maps.places.PlacesService(map);
			          service.getDetails(request, callback);
			          panorama = map.getStreetView();
				        panorama.setPosition({lat:parseFloat(lati), lng:  parseFloat(long)});
				        panorama.setPov(/** @type {google.maps.StreetViewPov} */({
				          heading: 265,
				          pitch: 0
				        }));
			        			function getStarRating(rating)
									{
										if(rating!=undefined)
										{
									    star = parseFloat(rating);
									    
									    var i = Math.floor(star);
									    var starHTML=" ";
									    while(i>0)
									        {
									        	i--;
									            starHTML+='<i class="fa fa-star" aria-hidden="true" style="color:orange;"></i>';
									            
									        }
									    var partStar = star-parseFloat(Math.floor(star));
									    if(partStar!=0)
									    starHTML+='<i class="fa fa-star" aria-hidden="true" style="background: linear-gradient(to left, transparent '+(1-partStar)*100+'%, orange 0%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i>'
									    
									    return starHTML;
									   }
									   else return "";
									}

								function callback(place, status) {
							              if (status == google.maps.places.PlacesServiceStatus.OK) {
							                // console.log(place);
							              	// console.log("$scope.detailsResults.geometry.location.lat "+place.geometry.location.lat);
							                starText = [];
							              stars = parseFloat(place.rating);
							             price =parseInt(place.price_level);
							             var utc_offset = place.utc_offset;
							           if("opening_hours" in place)
							           {
							           		
								             var weekday_text = place.opening_hours.weekday_text;
								             var day = moment().utcOffset(utc_offset).format('E');
								             // console.log( " weekday_text" + day);s


								           
								             if(place.opening_hours.open_now==true)
								             {
			    									document.getElementById('todayOpen').innerHTML= "Open now : &nbsp;"+ weekday_text[day-1].split(":").slice(1).join(':')+"  " +"<a  data-toggle='modal' href='#myModal'> Daily Open Hours</a></td>";
			    									
											}
											else
											{
												document.getElementById('todayOpen').innerHTML= "Closed  &nbsp; " +"<a  data-toggle='modal' href='#myModal'> Daily Open Hours</a></td>";      
											}
											if (day!=0)
												  day=day-1;
												    rotate( weekday_text ,day );
												    modalText= "<table class='table'>";
												    
												    for(var i=0;i<weekday_text.length;i++)
												    {
												      if(i==0)
												        modalText +="<tr><td><strong> "+weekday_text[i].split(":")[0] +"</strong> </td> <td> <strong>"+weekday_text[i].split(":").slice(1).join(':')+ "</strong> </td></tr>";
												      else
												        modalText+="<tr><td> "+weekday_text[i].split(":")[0] +"</td> <td>"+weekday_text[i].split(":").slice(1).join(':')+ " </td></tr>";
												    }
												    modalText+="</table>";
												    document.getElementById('modalBody').innerHTML = modalText;
									   }
									   if ( "reviews" in  place)
									   {	
									   		for(var j =0; j<place.reviews.length; j++)
									   		{
									   			var timestamp = place.reviews[j].time;
									   			place.reviews[j].time_created=moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
									   			place.reviews[j].starRating = getStarRating(place.reviews[j].rating);
									   		}
									   }
							            priceText="";
							             while(price>0)
							             {
							             	priceText+= "$";
							             	price--;
							             }
							             starText =place.rating + getStarRating(place.rating);
							             // while(stars>0.5)
							             // {
							             // 		starText.push("<span class='glyphicon glyphicon-star star-color'></span>");
							             // 		stars=stars-1;
							             // }
							             // if(stars==0.5)
							             // 	starText.push("<span class='glyphicon glyphicon-star star-color half'></span>");

							             if(typeof place.opening_hours !=='undefined')
							             {
							             		place.openHoursPresent = true;
							             }
							             else
							             {
							             		place.openHoursPresent = false;
							             }
										place.priceText="";
							             photosSrc= [];
							             for (var i=0;place.photos!=undefined && i<place.photos.length;i++)
							             {
							             	photosSrc[i] = place.photos[i].getUrl({'maxWidth': 1600, 'maxHeight': 800});
							         	 }
							         		var name =place.name;
							         		var city, country,state,address="";
							         		if( place.address_components!=undefined){
								         		for(var i=0; i<place.address_components.length;i++)
								         		{
								         			// console.log("place.address_components[i].types[0]"+place.address_components[i].types[0]);
								         			switch( place.address_components[i].types[0]){

								         				case "locality" : city =place.address_components[i].long_name; break;
								         				case "administrative_area_level_1": state = place.address_components[i].short_name; break;
								         				case "country":country =place.address_components[i].short_name; break;
								         				case "street_number":address = place.address_components[i].short_name ;break;
								         				case "route" : address+=place.address_components[i].short_name ;break;
								         			}
								         		}
								         		var yelpUrl = '/yelpname/name='+name +"&city=" +city +"&country="+country+ "&state="+state;
								         		if(address.length>0)
								         		{
								         			yelpUrl+="&address1="+address;
								         		}
								         		$http.get(yelpUrl)
								         		.success(function(res) {
								         			// console.log("yesssss YELP IS FUCKING DONE" +JSON.stringify(res));
								         			if(res.businesses[0]!=undefined)
								         			{
								         				var business_id =res.businesses[0].id;
								         				var yelpReviewUrl="/businesses/"+business_id+"/reviews";
								         				$http.get(yelpReviewUrl)
								         				.success(function(reviews){
								         						// console.log( " reviews" +JSON.stringify(reviews));
								         						
								         							for( var j=0; j<reviews.reviews.length; j++)
								         							{
								         								reviews.reviews[j].starRating = getStarRating(reviews.reviews[j].rating);
								         							}
								         						
								         						$scope.yelpReviews =reviews.reviews;

								         				})
								         				.error(function(err){
								         						// console.log(" Erorrr reviews for yelp");
								         						$scope.errorMessage="Error retreiving reviews for yelp";
								         				});

								         			}

								         		})
								         		.error(function(error){
								         			// console.log("err yelppp or");
								         			$scope.errorMessage="Error locating place in yelp";
								         		});
							                }
							              
							                $scope.$apply(function(){
								        			 $scope.detailsResults = place;
								        			 $scope.destinationLat = place.geometry.location.lat;
										             $scope.destinationLong=place.geometry.location.lng;
											         $scope.detailsResults['starText'] =starText;
											         $scope.toRoute =place.name +", "+ place.formatted_address;
											         var websiteAddress;
											         if(place.website!=undefined)
											         	websiteAddress=place.website;
											         else
											         	websiteAddress="http://www.google.com";
											         $scope.twitterText="https://twitter.com/intent/tweet?text=Check out "+place.name+ " located at "+place.formatted_address+" Website:"+"&url="+ websiteAddress + "&hashtags="+ encodeURIComponent('TravelAndEntertainmentSearch');
										             $scope.detailsResults['priceText'] = priceText;
										             $scope.detailsResults['photoSrcs'] = photosSrc;
										              $scope.reviewSelected($scope.reviewSelectedOption);
										              $scope.photoCol1 =[];
										         		$scope.photoCol2=[];
										         		$scope.photoCol3=[];
										         		$scope.photoCol4=[];
										         		for(var j=0;  j<photosSrc.length;j++)
										         		{
										         			if(j%4==0)
										         			{
										         				$scope.photoCol1.push(photosSrc[j]);
										         			}
										         			else if(j%4==1)
										         			{
										         				$scope.photoCol2.push(photosSrc[j]);
										         			}
										         			else if(j%4==2)
										         			{
										         				$scope.photoCol3.push(photosSrc[j]);
										         			}
										         			else if(j%4==3)
										         			{
										         				$scope.photoCol4.push(photosSrc[j]);
										         			}
										         		}    
							   			 })
							              }

            		}
            		
         
      };
      $scope.toggleDisplayToResultsTable = function()
     	{
     		if( $scope.lastTab=="results")
     			$scope.IsVisible = true;
     		else if ($scope.lastTab ="favourites")
     			$scope.isFavourites=true;
     		$scope.IsDetailsVisible =false;

     	};
     	$scope.clearSearch = function()
     	{
     		$scope.customplace="";
     		$scope.favPageNumber=1;
     		$scope.resultsTabClass ="active";
     		$scope.favTabClass="";
     		$scope.disableGetDirections=true;
     		$scope.lastTab ="";
     		$scope.detailsDisabled="checked";
     		$scope.keyword="";
	     	$scope.IsDetailsVisible =false;
     		$scope.isFavourites =false;
     		$scope.IsVisible = false;
     		$scope.mapshow = true;
			$scope.resultsJson=[];
			$scope.currentPage=1;
			$scope.googleReviewsSelected=true;
			$scope.errorMessage="";
			$scope.isFavourites =false;
			$scope.favouritesList={};
			$scope.detailsDisabled= "checked";
			$scope.destinationLat="";
			$scope.destinationLong="";
			$scope.orderby ="";
			$scope.previousButton = false;
			$scope.nextButton = false;
			$scope.formControlKeyword = "";
			$scope.formControllocation = "";
		    $scope.tableDisplay =false;
			$scope.disablecusloc =true;
			$scope.favourites=[];
			$scope.locrequired =false;
			$scope.disablesearch =true;
			$scope.reviewSelectedOption ="Google Reviews";
			$scope.orderSelectedOption ="Default Order";
			$scope.myLoc = "currentLoc";
			$scope.category='Default';
			$scope.errorMsg = "";
			$scope.distance=undefined;
			$scope.initializeFavorites();
     	}
     	$scope.reviewSelected = function(reviewname)
     	{
     			$scope.reviewSelectedOption =reviewname.trim();
     			if($scope.reviewSelectedOption=='Google Reviews')
     			{
     				$scope.googleReviewsSelected = true;
     				
     			}
     			else if($scope.reviewSelectedOption=='Yelp Reviews' )
     			{
     				$scope.googleReviewsSelected = false;

     			
     			}
     			// console.log("$scope.reviewSelectedOption"+$scope.reviewSelectedOption );

     	};
     	$scope.orderSelected = function(orderby)
     	{

     		$scope.orderSelectedOption =orderby;
     		
     		if($scope.orderSelectedOption=="Default Order")
     		{
     			$scope.orderby ='';

     		}
     		else if($scope.orderSelectedOption=="Highest Rating")
     		{
     			$scope.orderby ="-rating";


     		}
     		else if($scope.orderSelectedOption=="Lowest Rating")
     		{
     				$scope.orderby ="rating ";
     		}
     		else if($scope.orderSelectedOption=="Most Recent")
     		{
     				$scope.orderby ="-time_created";
     		}
     		else if($scope.orderSelectedOption=="Least Recent"){
     			$scope.orderby ="time_created";

     		}
     	};
     	$scope.fromAddressChange =function(){
     		if( $scope.fromAddressForRoute.trim().length>0)
     			$scope.disableGetDirections =false;
     		else
     			$scope.disableGetDirections =true;
     			

     	};
     	$scope.toggleMapPano = function(){
     		
     			
     	$scope.mapshow =$scope.mapshow? false:true;
     	var toggle = panorama.getVisible();
        if (toggle == false) {
          panorama.setVisible(true);
        } else {
          panorama.setVisible(false);
        }
     		
     	}
     	$scope.calculateAndDisplayRoute = function() {
     		var  dest =$scope.detailsResults.name + ", "+$scope.detailsResults.formatted_address;
     		var org;
     		console.log(" calcc" +JSON.stringify(fromRoute));
     		if( fromRoute!=undefined && "formatted_address" in fromRoute )
     		{
     			// console.log(" hereeee _if");
	     	
	     		org=fromRoute.formatted_address;
     		}
     		else
     		{
     			if( $scope.fromAddressForRoute.toUpperCase()=="Your Location".toUpperCase() || $scope.fromAddressForRoute.toUpperCase()=="My Location".toUpperCase()) 
     			{


     					console.log(" hereeee");
     					org= {lat:  parseFloat($scope.latitude), lng:  parseFloat($scope.longitude)};
     			}
     			else
     			{
     				// console.log(" heree else" +$scope.fromAddressForRoute);
     					org = $scope.fromAddressForRoute;
     			}
     		}
     		var mode =$scope.route;

     		// console.log("hereeee route" + mode +" " +  dest +" "+ fromRoute.formatted_address + " " +org);
						        directionsService.route({
						          origin: org,
						          destination:dest,
						          travelMode: mode,
						          provideRouteAlternatives:true
						        }, function(response, status) {
						          if (status === 'OK') {
						          	console.log( "response" + JSON.stringify(response) );
						          	marker.setMap(null);
						            directionsDisplay.setDirections(response);


						          } else {
						            window.alert('Directions request failed due to ' + status);
						          }
						        });
      };
});
