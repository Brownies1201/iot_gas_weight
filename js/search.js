//variable inital
var map;
var infoWindow;
var service;
var directionsService;
var directionsDisplay;
var pos;
//Change default shop
var ChangeDefaultShop = function(shop_name, shop_phone, shop_address){
  $.ajax({
    type: "POST",
    url: '../php/set_change.php',
    data: {shop_name:shop_name, shop_phone:shop_phone,  shop_address: shop_address},
    success: function(data){  
        if(data){
          if(data=="success"){
            alert("更新成功");
          }else{
             alert("更新失敗");
          }
        }
    },
    error: function(data) {
      alert("資料庫連結失敗，請在重新輸入一次");
    }
  });
};
//initial map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 24.121930, lng:  120.674478},
    zoom: 15,
    styles: [{
      stylers: [{ visibility: 'simplified' }]
    }, {
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }]
  });
  //set markers info window
  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  //geolocation
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //start marker
        var now_marker = new google.maps.Marker({
            map: map,
            position: pos,
            icon: '../img/new_marker_dest.png',
        });
        //start marker info window
        infoWindow.setContent("現在位置");
        infoWindow.open(map, now_marker);
        //map center set
        map.setCenter({lat: pos.lat, lng: pos.lng}); 
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }        
  // The idle event is a debounced event, so we can query & listen without
  // throwing too many requests at the server.
  map.addListener('idle', performSearch);
}
//waiting map load finish and key word search 
function performSearch() {
  //key word set
  var request = {
    bounds: map.getBounds(),
    keyword: '瓦斯'
  };
  //search
  service.radarSearch(request, callback);
  //map loading finish animation
  $('#map').css('visibility', 'visible');
  $('#map').addClass('animated fadeIn');
}
//map status callback
function callback(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  //add key word result markers
  for (var i = 0, result; result = results[i]; i++) {
    addMarker(result);
  }
}
//add marker
function addMarker(place) {
  //marker set
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: '../img/new_marker_start.png',

  });
  //marker click event listener
  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        //Set marker window info
        var contentString = '<div class="btn-group marker_info"><strong>'+result.name+
         '</strong>'+
         '<br>'+
        result.formatted_address+
         '<br>'+
        result.formatted_phone_number+
         '<br><button type="button" class="btn  btn-xs btn-primary btn_route">路線</button>'+
         '<button type="button" class="btn  btn-xs btn-info btn_phone">打電話</button>'+
          '<button type="button" class="btn  btn-xs btn-primary btn_setting">設為常用</button></div>';
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
        //info window btns click event
        $(".btn_route").click(function() {//find direction route
            location.href="../page/set_get_direction.html?"+result.formatted_address;
        }); 
        $(".btn_phone").click(function() {//call phone number
            location.href='tel:'+ result.formatted_phone_number;
        }); 
        $(".btn_setting").click(function() {//set to default gas shop
            ChangeDefaultShop(result.name, result.formatted_phone_number, result.formatted_address);
        }); 
    });
  });
} 