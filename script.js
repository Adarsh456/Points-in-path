var locations = new Array();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();


function initialize() {
    var UserSource = document.getElementById('searchTextFieldSource');
    var UserDestination = document.getElementById('searchTextFieldDestination');
    var DbSource = document.getElementById('searchTextFieldIntermediateSource');
	var DbDestination = document.getElementById('searchTextFieldIntermediateDestination');
	
    var ACUserSource = new google.maps.places.Autocomplete(UserSource);
    var ACUserDestination = new google.maps.places.Autocomplete(UserDestination);
    var ACDbSource = new google.maps.places.Autocomplete(DbSource);
	var ACDbDestination = new google.maps.places.Autocomplete(DbDestination);
	
    google.maps.event.addListener(ACDbDestination, 'place_changed', function () {
        var place1 = ACUserSource.getPlace();
        
		document.getElementById('city1').value = place1.name;
        
		var place1Lat = place1.geometry.location.lat();
        var place1Lng = place1.geometry.location.lng();
		
        document.getElementById('cityLat1').value = place1Lat;
        document.getElementById('cityLng1').value = place1Lng;

        var obj = new Object();
        obj.city = place1.name;
        obj.latitude = place1.geometry.location.lat();
        obj.longitude = place1.geometry.location.lng();
        locations.push(obj);


        var place2 = ACUserDestination.getPlace();
        document.getElementById('city2').value = place2.name;
        var place2Lat = place2.geometry.location.lat();
        var place2Lng = place2.geometry.location.lng();
        document.getElementById('cityLat2').value = place2Lat;
        document.getElementById('cityLng2').value = place2Lng;

        var obj = new Object();
        obj.city = place2.name;
        obj.latitude = place2.geometry.location.lat();
        obj.longitude = place2.geometry.location.lng();
        locations.push(obj);

        //For intermediate point Source
        var place3 = ACDbSource.getPlace();
        document.getElementById('city3').value = place3.name;
        var place3Lat = place3.geometry.location.lat();
        var place3Lng = place3.geometry.location.lng();
        document.getElementById('cityLat3').value = place3Lat;
        document.getElementById('cityLng3').value = place3Lng;
		
		 //For intermediate point Destination
		var place4 = ACDbDestination.getPlace();
        document.getElementById('city4').value = place4.name;
        var place4Lat = place4.geometry.location.lat();
        var place4Lng = place4.geometry.location.lng();
        document.getElementById('cityLat4').value = place4Lat;
        document.getElementById('cityLng4').value = place4Lng;
		
		var p1 = new google.maps.LatLng(place1Lat, place1Lng);
		var p2 = new google.maps.LatLng(place2Lat, place2Lng);

        directionsDisplay = new google.maps.DirectionsRenderer();
		
        var startPlace = new google.maps.LatLng(place1Lat, place1Lng);

        var mapOptions = {
            zoom: 7,
            center: startPlace
        }

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        directionsDisplay.setMap(map);

        var start = $("#city1").val();
        var end = $("#city2").val();

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        var positionsource = new google.maps.LatLng(place3Lat, place3Lng);
		var positiondestination = new google.maps.LatLng(place4Lat, place4Lng);

        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);

                if ((google.maps.geometry.poly.isLocationOnEdge(positionsource,
                    new google.maps.Polyline({ path: google.maps.geometry.encoding.decodePath(result.routes[0].overview_polyline) }),
                    0.0100000000))&(google.maps.geometry.poly.isLocationOnEdge(positiondestination,
                    new google.maps.Polyline({ path: google.maps.geometry.encoding.decodePath(result.routes[0].overview_polyline) }),
                    0.0100000000))) {
					
                    var heading2 = google.maps.geometry.spherical.computeHeading(positionsource, positiondestination);
                    if(heading2<0) {
	                    $(".results-display").html("Points C and D are in the Path of A->B but in Reverse direction");
                    }
    				else {
         		        $(".results-display").html("Points C and D are in the Path of A->B and in Straight direction");
    				}
                }
                else {
                    $(".results-display").html("Points C and D are not in the path of A->B");
                }
              }
        });
    });
}
google.maps.event.addDomListener(window, 'load', initialize);

function refreshMap(locations) {
    google.maps.visualRefresh = true;
    var map = new google.maps.Map(document.getElementById(map), {
        zoom: 10,
        center: new google.maps.LatLng(locations[0].latitude, locations[0].longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i].city);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}
