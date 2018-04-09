/***************************************************************************************
*    Title: Flight Data Visualization
*	 Author: Ishita Mathur and Neha Bhagwat
*    Date: March 23, 2018
***************************************************************************************/

//global variables
var map;
const routeSet = new Set();					//stores list of routes
const pinSet = new Set();					//stores list of airports
const codeList = new Set();					
const uniquePin = new Set();				//stores unique list of airports
airlineSet = new Set();						//stores list of airlines
var sortedAirports = new Array();			//stores alphabetical list of airports
var exploredPaths = new Array();			//stores list of explored paths when "Explore" option is chosen
var mode;									//stores mode of map
var pinColor;								//stores color of airport pin according to mode of map
var routeColor;								//stores color of route polyline according to mode of map

//startTime() - function to set clock
function startTime()
{
	  var today=new Date();
	  var h=today.getHours();
	  var m=today.getMinutes();
	  var s=today.getSeconds();
	  m=checkTime(m);
	  s=checkTime(s);
	  document.getElementById('clock').innerHTML=h+":"+m+":"+s;
	  t=setTimeout('startTime()',500);
}

//checkTime() - function to prefix 0 if hour/minutes/seconds < 10
function checkTime(i){
	  if (i<10){
	  	i="0" + i;
	  }
	  return i;
}



/***************************************************************************************
*    Title: Simple Map
*	 Author: Google
*    Date: August 29, 2017
*    Availability: https://developers.google.com/maps/documentation/javascript/examples/map-simple
*
***************************************************************************************/
//initMap() - function to initialize map
function initMap(lat, long) {
        now = new Date();
        hour = now.getHours();
        if(typeof(lat) === 'undefined') lat = 37.359;
		if(typeof(long) === 'undefined') long = -121.929;
		console.log("init map");

		if(hour > 4 && hour < 18){
			//initialize map in day mode
			mode = 'd';
			map = new google.maps.Map(document.getElementById('map'), {
			  center: {lat: lat, lng: long},
			  zoom: 6
			});
		}
		else{
        // Styles a map in night mode.
        	mode = 'n';
	        map = new google.maps.Map(document.getElementById('map'), {
	          center: {lat: lat, lng: long},
	          zoom: 6,
	          styles: [
	            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
	            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
	            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
	            {
	              featureType: 'administrative.locality',
	              elementType: 'labels.text.fill',
	              // stylers: [{color: '#d59563'}]
	              stylers: [{color: '#0ADEE2'}]
	            },
	            {
	              featureType: 'poi',
	              elementType: 'labels.text.fill',
	              stylers: [{color: '#d59563'}]
	            },
	            {
	              featureType: 'poi.park',
	              elementType: 'geometry',
	              stylers: [{color: '#263c3f'}]
	            },
	            {
	              featureType: 'poi.park',
	              elementType: 'labels.text.fill',
	              stylers: [{color: '#6b9a76'}]
	            },
	            {
	              featureType: 'road',
	              elementType: 'geometry',
	              stylers: [{color: '#38414e'}]
	            },
	            {
	              featureType: 'road',
	              elementType: 'geometry.stroke',
	              stylers: [{color: '#212a37'}]
	            },
	            {
	              featureType: 'road',
	              elementType: 'labels.text.fill',
	              stylers: [{color: '#9ca5b3'}]
	            },
	            {
	              featureType: 'road.highway',
	              elementType: 'geometry',
	              stylers: [{color: '#746855'}]
	            },
	            {
	              featureType: 'road.highway',
	              elementType: 'geometry.stroke',
	              stylers: [{color: '#1f2835'}]
	            },
	            {
	              featureType: 'road.highway',
	              elementType: 'labels.text.fill',
	              stylers: [{color: '#f3d19c'}]
	            },
	            {
	              featureType: 'transit',
	              elementType: 'geometry',
	              stylers: [{color: '#2f3948'}]
	            },
	            {
	              featureType: 'transit.station',
	              elementType: 'labels.text.fill',
	              stylers: [{color: '#d59563'}]
	            },
	            {
	              featureType: 'water',
	              elementType: 'geometry',
	              stylers: [{color: '#17263c'}]
	            },
	            {
	              featureType: 'water',
	              elementType: 'labels.text.fill',
	              stylers: [{color: '#515c6d'}]
	            },
	            {
	              featureType: 'water',
	              elementType: 'labels.text.stroke',
	              stylers: [{color: '#17263c'}]
	            }
	          ]
	        });
	    }
      }

//Pin() - constructor to create an airport object with details about an airport
function Pin(IATACode, lat, long, City, AirportName, ICAOCode, Country){
	this.IATACode = IATACode;
	this.lat = parseFloat(lat);
	this.long = parseFloat(long);
	this.City = City;
	this.AirportName = AirportName;
	this.ICAOCode = ICAOCode;
	this.Country = Country;
	this.display = function(){
		console.log("IATACode: " + this.IATACode + ", Latitude: " + this.lat + ", Longitude: " + this.long + ", ICAOCode" + this.ICAOCode + ", " + this.City + ", " + this.AirportName + "," + this.Country);
	}
	this.toString = function(){
		return this.IATACode + "-" + this.AirportName + "," + this.City
	}
}

//Route() - constructor to create a route object with details about a route
function Route(src, dest, lat1, long1, lat2, long2, airline, equipment){
	this.src = src;
	this.dest = dest;
	this.lat1 = parseFloat(lat1);
	this.long1 = parseFloat(long1);
	this.lat2 = parseFloat(lat2);
	this.long2 = parseFloat(long2);
	this.airline = airline;
	this.equipment = equipment;
	this.display = function(){
		console.log("Source: " + this.src);
		console.log("Destination: " + this.dest);
		console.log("Source latitude: " + this.lat1);
		console.log("Source longitude: " + this.long1);
		console.log("Destination latitude: " + this.lat2);
		console.log("Destination: longitude" + this.long2);
		console.log("Airline: " + this.airline);
		console.log("Equipment: " + this.equipment);
	}
}

//toRadians() - function to convert an angle from degree to radian
function toRadians(v){
	return v * Math.PI / 180;
}


//handle_file() - function to handle file input
function handle_file(file){
	var reader = new FileReader();
	reader.onload = readSuccess;
	function readSuccess(e){
		//console.log(e.target.result);
		var count = 0;
		var lines = e.target.result.split('\n');
		for(var line = 0; line<lines.length; line++){
			var data = lines[line].split(',');
			//console.log(data);
			var r = new Route(data[0],data[1],data[2],data[3],data[4],data[5], data[13], data[12]);
			routeSet.add(r);
			airlineSet.add(data[13]);
			var p1 = new Pin(data[0], data[2], data[3], data[6], data[18], data[20], data[7]);
			var p2 = new Pin(data[1], data[4], data[5], data[8], data[19], data[21], data[9]);
			pinSet.add(p1);
			pinSet.add(p2);
			codeList.add(data[0]);
			codeList.add(data[1]);
		}
		for(var v of codeList){
			for(var v1 of pinSet){
				if(v == v1.IATACode && typeof(v1.IATACode) !== 'undefined' && v1.IATACode != ""){
					uniquePin.add(v1);
					break;
				}
			}
		}

		for(var v of uniquePin){
			sortedAirports.push(v.toString());
		}

		sortedAirports.sort();

		airlineSet = new Set(Array.from(airlineSet).sort());
		
		console.log(routeSet.size);

		console.log(pinSet.size);

		console.log(uniquePin.size);

		console.log(sortedAirports.size);

		console.log(airlineSet.size);
	}
	reader.readAsText(file);
}


//selectFunction() - onchange method for dropdown to choose viewing mode
function selectFunction(selectedObject){
	errorLabel.innerHTML = "";
	errorLabel.hidden = true;
	if(selectedObject.value!=""){
		initMap();
	}
	if(selectedObject.value!="specificroute"){
		document.getElementById('selectSrc').hidden = true;
		document.getElementById('selectDest').hidden = true;
		routebutton.hidden = true;
	}
	if(selectedObject.value!="airline"){
		document.getElementById('selectAirline').hidden = true;
		airlinebutton.hidden = true;
	}
	if(selectedObject.value!="explore"){
		resetbutton.hidden = true;
	}
	if(mode == 'd')
		pinColor = "AirportPin.png";
	else
		pinColor = "AirportPinRed.png"
	if(selectedObject.value == "airports"){
		//display all airports
		console.log("Selected airports");
		for(var v of uniquePin){
		 	var icon = {
		 		url: pinColor,
		 		scaledSize: new google.maps.Size(8,8),
		 		origin: new google.maps.Point(0,0),
		 		anchor: new google.maps.Point(0,0)
		 	};
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(v.lat,v.long),
		 		map:map,
		 		icon: icon
		 	});
		 }
	}
	else if(selectedObject.value == "routes"){
		//display all routes
		console.log("Selected routes");
		for(var v of uniquePin){
		 	var icon = {
		 		url: pinColor,
		 		scaledSize: new google.maps.Size(8,8),
		 		origin: new google.maps.Point(0,0),
		 		anchor: new google.maps.Point(0,0)
		 	};
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(v.lat,v.long),
		 		map:map,
		 		icon: icon
		 	});
		 }

		 console.log("All routes, set size " + routeSet.size);
		for(var v of routeSet){
			var path = [
			{lat:v.lat1, lng:v.long1},
			{lat:v.lat2, lng:v.long2}];
			var route = new google.maps.Polyline({
				path: path,
				geodesic: true,
				strokeColor: "#7FFF00",
				strokeOpacity: 0.1,
				strokeWeight: 0.5
			});
			route.setMap(map);
		}
	}
	else if(selectedObject.value == "specificroute"){
		//populate and show drop down menus to select source and destination

		var innersrc = "<option value = \"\"> Select Source Airport </option>";
		var innerdest = "<option value = \"\"> Select Destination Airport </option>";
		var code;
		for(var v of sortedAirports){
			code = v.split("-");
			if(typeof(code[0])!=='undefined' && code[0]!=""){
				innersrc += "<option value = \"" + code[0] + "\">" + v + "</option>";
				innerdest += "<option value = \"" + code[0] + "\">" + v + "</option>";
			}
		}
		document.getElementById('selectSrc').innerHTML = innersrc;
		document.getElementById('selectDest').innerHTML = innerdest;
		document.getElementById('selectSrc').hidden = false;
		document.getElementById('selectDest').hidden = false;
		routebutton.hidden = false;
	}
	else if(selectedObject.value == "airline"){
		//populate and show drop down menu to choose airline

		var inner = "<option value = \"\"> Select Airline </option>";
		for(var v of airlineSet)
			if(v != "" && !(typeof(v) === 'undefined'))
				inner += "<option value = \"" + v + "\">" + v + "</option>";
		document.getElementById('selectAirline').innerHTML = inner;
		document.getElementById('selectAirline').hidden = false;
		airlinebutton.hidden = false;
	}
	else if(selectedObject.value== "explore"){
		explore();
		resetbutton.hidden = false;
	}
	else{}

}

//explore() - function to display all airport pins and handle click events
function explore(){
	//display all airports
	var ar = ["",""];
	var markers = [];
	console.log("Selected airports");
	var i = 0;
	var routeCount = 0;
	for(var v of uniquePin){
	 	var icon = {
	 		url: pinColor,
	 		scaledSize: new google.maps.Size(10,10),
	 		origin: new google.maps.Point(0,0),
	 		anchor: new google.maps.Point(0,0)
	 	};
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(v.lat,v.long),
	 		map:map,
	 		icon: icon,
	 		id:v.IATACode
	 	});
	 	console.log(v.IATACode);
	 	markers.push(marker);
	 	google.maps.event.addListener(marker, 'click', (function(marker, i){
	 		return function(){
	 			console.log(markers[i].get('id'));
	 			if(ar[0] == ""){
	 				ar[0] = markers[i];
	 			}
	 			else if(ar[0] != "" && ar[1] == ""){
	 				ar[1] = markers[i];
	 				checkRoute(ar[0].id, ar[1].id, routeCount);
	 				routeCount += 1;
	 			}
	 			else{
	 				ar[0] = ar[1];
	 				ar[1] = markers[i];
	 				checkRoute(ar[0].id, ar[1].id, routeCount);
	 				routeCount += 1;
	 			}
	 			console.log(ar);
	 		}
	 	})(marker, i));
	 	i++;
	 }
}


//checkRoute() - function to check if route exists between 2 points and plot if it exists
function checkRoute(IATA1, IATA2, routeCount){
	console.log("routeCount: " + routeCount)
	if(routeCount > 0){
		try{
			old_route = exploredPaths.pop();
			old_route.setMap(null);
		}
		catch(err){
			console.log(err);
			console.log("The previous path was not drawn and therefore, could not be deleted.");
		}
	}
	if(IATA1 != "" && IATA2 != ""){
		if(mode == 'd')
			routeColor = "#FF0000";
		else
			routeColor = "#7FFF00";
		console.log("Checking if chose route exists between " + IATA1 + " and " + IATA2 + ".")
		flag = 0
		var route;
		var lat1, long1, lat2, long2;
		var airlineList = "Airlines: \n";
		var sourceAirport = IATA1;
		var destinationAirport = IATA2;
		for(var v of routeSet){
			if(v.src == sourceAirport){
				if(v.dest == destinationAirport){
					flag++;
					if(flag == 1){
						lat1 = v.lat1;
						long1 = v.long1;
						lat2 = v.lat2;
						long2 = v.long2;
					}

					if(v.airline != "NA")
						airlineList += v.airline + "-" + v.equipment + ", ";

					var path = [
					{lat:v.lat1, lng:v.long1},
					{lat:v.lat2, lng:v.long2}];
					
					route = new google.maps.Polyline({
					path: path,
					geodesic: true,
					strokeColor: routeColor,
					strokeCapacity: 0.1,
					strokeWeight: 2.0,
					id: routeCount
					});
					exploredPaths.push(route);
				}
			}
		}
		if(flag == 0){
			airlinedisplay.innerHTML = "No path exists from the chosen source to destination airport.";
			airlinedisplay.hidden = false;
			distance.innerHTML = "";
			distance.hidden = true;
		}
		else{
			route.setMap(map);
			
			console.log("Number of paths: " + flag)
			var d = calculateDistance(lat1, lat2, long1, long2);
	    
			var info = new google.maps.InfoWindow();
			google.maps.event.addListener(route, 'mouseover', function(e){
				console.log("Mouse at " + e.latLng);
				info.setPosition(e.latLng);
				current_lat = e.latLng.lat();
				current_long = e.latLng.lng();
				distance_to_destination = calculateDistance(current_lat, lat2, current_long, long2)
				info.setContent("You are at " + e.latLng + " <br>Source: " + IATA1 + "<br>Destination: " + IATA2 + "<br>Great Circle Distance: " + d + "mi <br> " + airlineList.slice(0,-2) + " <br>Distance to Destination: " + distance_to_destination + "mi");
				info.open(map);
			});
			google.maps.event.addListener(route, 'mouseout', function(e){
				console.log("Mouse out");
				info.close();
			});
		}
	}
}

//routeButton() - process view specific route request
function routeButton(){
	if(selectSrc.value == "" || selectDest.value == ""){
		errorLabel.innerHTML = "Select Source and Destination";
		errorLabel.hidden = false;
	}
	else{
		if(mode == 'd')
			routeColor = "#FF0000";
		else
			routeColor = "#7FFF00";
		console.log("Button Pressed");
		flag = 0
		var route;
		var airlineList = "Airlines: \n";
		var sourceAirport = selectSrc.value;
		var destinationAirport = selectDest.value;
		var lat1, long1, lat2, long2;
		for(var v of routeSet){
			if(v.src == sourceAirport){
				if(v.dest == destinationAirport){
					flag++;
					if(flag == 1){
						lat1 = v.lat1;
						long1 = v.long1;
						lat2 = v.lat2;
						long2 = v.long2;
					}

					if(v.airline != "NA")
						airlineList += v.airline + "-" + v.equipment + ", ";

					var path = [
					{lat:v.lat1, lng:v.long1},
					{lat:v.lat2, lng:v.long2}];
					route = new google.maps.Polyline({
					path: path,
					geodesic: true,
					strokeColor: routeColor,
					strokeCapacity: 0.1,
					strokeWeight: 2.0
					});
				}
			}
		}
		if(flag == 0){
			airlinedisplay.innerHTML = "No path exists from the chosen source to destination airport.";
			airlinedisplay.hidden = false;
			distance.innerHTML = "";
			distance.hidden = true;
		}
		else{
			initMap(lat1,long1);
			route.setMap(map);
			var icon = {
		 		url: "AirportPinRed.png",
		 		scaledSize: new google.maps.Size(15,15),
		 		origin: new google.maps.Point(0,0),
		 		anchor: new google.maps.Point(0,0)
		 	};
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat1,long1),
		 		map:map,
		 		icon: icon
		 	});
		 	var icon = {
		 		url: "AirportPinRed.png",
		 		scaledSize: new google.maps.Size(15,15),
		 		origin: new google.maps.Point(0,0),
		 		anchor: new google.maps.Point(0,0)
		 	};
		 	var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat2,long2),
		 		map:map,
		 		icon: icon
		 	});
			console.log("Number of paths: " + flag)
			var d = calculateDistance(lat1, lat2, long1, long2);

	    
			var info = new google.maps.InfoWindow();
			google.maps.event.addListener(route, 'mouseover', function(e){
				console.log("Mouse at " + e.latLng);
				info.setPosition(e.latLng);
				current_lat = e.latLng.lat();
				current_long = e.latLng.lng();
				// current_position = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
				distance_to_destination = calculateDistance(current_lat, lat2, current_long, long2)
				info.setContent("You are at " + e.latLng + " <br>Great Circle Distance: " + d + "mi <br> " + airlineList.slice(0,-2) + " <br>Distance to Destination: " + distance_to_destination + "mi");
				info.open(map);
			});
			google.maps.event.addListener(route, 'mouseout', function(e){
				console.log("Mouse out");
				info.close();
			});
		}
	}
}

//calculateDistance() - function to calculate distance between 2 coordinates
function calculateDistance(lat1, lat2, long1, long2){
	console.log(lat1);
	console.log(lat2);
	console.log(long1);
	console.log(long2);
	var r = 6371e3;
	var phi1 = toRadians(lat1);
	var phi2 = toRadians(lat2);
	var deltaphi = toRadians(lat2 - lat1);
	var deltalambda = toRadians(long2 - long1);
	var a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = r * c;
	return d * 0.00062137;
}

//airlineButton() - process view specific airline request
function airlineButton(){
	if(selectAirline.value == ""){
		errorLabel.innerHTML = "Select Airline";
		errorLabel.hidden = false;
	}
	if(selectAirline.value != ""){
		console.log("Airline button pressed");
		selectedAirline = selectAirline.value;
		var path_count = 0;
		var routes =[];
		var i =0;
		for(var v of routeSet){
			if(v.airline == selectedAirline){
				path_count += 1;
				var path = [
					{lat:v.lat1, lng:v.long1},
					{lat:v.lat2, lng:v.long2}];
					var icon = {
				 		url: "AirportPinPink.png",
				 		scaledSize: new google.maps.Size(15,15),
				 		origin: new google.maps.Point(0,0),
				 		anchor: new google.maps.Point(0,0)
				 	};
				 	var marker = new google.maps.Marker({
						position: new google.maps.LatLng(v.lat1,v.long1),
				 		map:map,
				 		icon: icon
				 	});
				 	var marker = new google.maps.Marker({
						position: new google.maps.LatLng(v.lat2,v.long2),
				 		map:map,
				 		icon: icon
				 	});
					var route = new google.maps.Polyline({
						path: path,
						src_lat: v.lat1,
						src_long: v.long1,
						dest_lat: v.lat2,
						dest_long: v.long2,
						src_city:v.src,
						dest_city:v.dest,
						geodesic: true,
						strokeColor: "#7FFF00",
						strokeCapacity: 0.1,
						strokeWeight: 0.5
					});
					route.setMap(map);
					routes.push(route);
					var info = new google.maps.InfoWindow();
					google.maps.event.addListener(route, 'mouseover', (function(route, i){
						return function(e){
							info.setPosition(e.latLng);
							current_lat = e.latLng.lat();
							current_long = e.latLng.lng();
							d = calculateDistance(routes[i].src_lat, routes[i].src_long, routes[i].dest_lat, routes[i].dest_long)
							distance_to_destination = calculateDistance(current_lat, routes[i].dest_lat, current_long, routes[i].dest_long)
							info.setContent("You are at " + e.latLng + "<br>Source: " + routes[i].src_city + "<br>Destination: " + routes[i].dest_city +" <br>Great Circle Distance: " + d + "mi <br>Distance to Destination: " + distance_to_destination + "mi");
							info.open(map);
						}
						
					})(route, i));	
					google.maps.event.addListener(route, 'mouseout', (function(route, i){
						return function(e){
							info.close();
						}
					})(route, i));	
					i++;
			}
		}
		if(path_count == 0){
			console.log("No paths exist for the chosen airline.")
		}
		else{
			console.log("Number of paths for the chosen airline: " + path_count)
		}
	}
}

//resetButton() - resets map when explore option is chosen
function resetButton(){
	initMap();
	explore();
}

//selectedSrc() - onchange menthod for drop down to select source airport in specific route
function selectedSrc(){
	errorLabel.innerHTML = "";
	errorLabel.hidden = true;
}

//selectedDest() - onchange method for drop down to select destination airport in specific route
function selectedDest(){
	errorLabel.innerHTML = "";
	errorLabel.hidden = true;
}

//changedAirline() - onchange method for drop down to select airline in specific airline
function changedAirline(){
	errorLabel.innerHTML = "";
	errorLabel.hidden = true;
	initMap();
}

//mainFun() - called after data file input
function mainFun(files){
	startTime()
	handle_file(files[0]);
}