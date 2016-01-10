//variable initial
//google map service var
var map;
var directionsDisplay;
var directionsService;
var geocoder;
//markers and infoWindow
var infoWindow;
var start_marker;
var destination_marker;
//start and destination
var start;
var destination =  decodeURI(window.location.href.split('?')[1]);//get the parameter from url
//Documet ready
$(function () {
	OpenRightPanel();
	CloseRightPanel();
});
//initial map
function initMap() {
	//map initial setting
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 24.121930, lng:  120.674478},
		zoom: 15
	});
	directionsDisplay = new google.maps.DirectionsRenderer;//direction set
		directionsService = new google.maps.DirectionsService;//direction set
	infoWindow = new google.maps.InfoWindow({map: map});//marker info set
	geocoder = new google.maps.Geocoder;//geocoder set

	//Direction initial setting
	directionsDisplay.setMap(map);
	directionsDisplay.setOptions( { suppressMarkers: true } );//invisible the default markers of direction service
	directionsDisplay.setPanel(document.getElementById('right-panel'));//direction panel

	//Start geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			//set the start coordinate
			start = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			//Ready start geocoder
			geocodeLatLng(geocoder, directionsDisplay, directionsService, map, infoWindow, start, destination);
			//Map center by start coordinate
			map.setCenter(start);
		}, function() {//error handler
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
	//Set the direction of start and destination
	var DirectionFind = function() {
		//remove old markers
		start_marker.setMap(null);
		destination_marker.setMap(null);
		//get new start and destination
		start = $('#start_input').val();
		destination = $('#dest_input').val();
		//find new direction
		calculateAndDisplayRoute(directionsDisplay, directionsService, start, destination);
	};
	//find direction btn click event listener
	document.getElementById('find_direction').addEventListener('click', DirectionFind);
	//map load finish event listener
	map.addListener('idle', FinishLoad);
}
//Map loading finish event animation
function FinishLoad() {
	$('#map').css('visibility', 'visible');
	$('#map').addClass('animated fadeIn');
}
//Handle geolocation error
function handleLocationError(browserHasGeolocation, infoWindow, map_center) {
	infoWindow.setPosition(map_center);
	infoWindow.setContent(browserHasGeolocation ?
	                    'Error: The Geolocation service failed.' :
	                    'Error: Your browser doesn\'t support geolocation.');
}
//Turn coordinate into address
function geocodeLatLng(geocoder, directionsDisplay, directionsService, map, infowindow, start, destination) {
	geocoder.geocode({'location': start}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				//Caculate and display the route
				calculateAndDisplayRoute(directionsDisplay, directionsService, start, destination);
			} else {
				window.alert('No results found');
			}
		} else {
			window.alert('Geocoder failed due to: ' + status);
		}
	});
}
//Direction route display
function calculateAndDisplayRoute(directionsDisplay, directionsService, start, destination) {
	//set and display the route
	directionsService.route({
		origin: start,
		destination: destination,
		travelMode: google.maps.TravelMode.DRIVING
	}, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			//set direction display
			directionsDisplay.setDirections(response);
			//get start and destination information
			var route_marker_set = response.routes[0].legs[0];
			//markers set
			$('#start_input').val( route_marker_set.start_address);//get input val
			start_marker = new google.maps.Marker({//start marker set
				position: route_marker_set.start_location,
				icon: '../img/new_marker_start.png',
				map: map
			});
			
			$('#dest_input').val( route_marker_set.end_address);//get input val
			destination_marker = new google.maps.Marker({//destination marker set
				position: route_marker_set.end_location,
				icon: '../img/new_marker_dest.png',
				map: map
			});
			//Destination marker info window set
			var dest_infowindowContent = "<b><p style='text-align: center;''>目的地</p></b>";
			infoWindow.setContent(dest_infowindowContent);
				infoWindow.open(map, destination_marker);
		}else{
			window.alert('Directions request failed due to ' + status);
		}
	});
}
//Open panel
var OpenRightPanel = function(){
	$('#open_panel').click(function() {
		//mobile event
		if($( window ).width()<770){
			$( ".navbar-toggle" ).trigger( "click" );
		}
		//open panel animation
		$('#open_panel').css('visibility', 'hidden');
		$('.right-panel-row').css('visibility', 'visible');
		$('.right-panel-row').removeClass('animated fadeOut');
		$('.right-panel-row').addClass('animated fadeInDown');				
	});
};
//close panel
var CloseRightPanel = function(){
	$('#close_panel').click(function() {
		//mobile event
		$('html, body').scrollTop(0);
		//close panel animation
		$('#open_panel').css('visibility', 'visible');
		$('.right-panel-row').removeClass('animated fadeInDown');
		$('.right-panel-row').addClass('animated fadeOut');
		if($('#right-panel-row').css('opacity')==0){//check it finish already
			$('.right-panel-row').css('visibility', 'hidden');
			$('.right-panel-row').css('z-index', 2);
		}
	});
};