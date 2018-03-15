$(function() {
  accessToken = 'pk.eyJ1IjoiY29yZXl0ZWdlbGVyIiwiYSI6ImNpd25xNjU0czAyeG0yb3A3cjdkc2NleHAifQ.EJAjj38qZXzIylzax3EMWg';
  mapboxgl.accessToken = accessToken;
  styleURI = 'mapbox://styles/coreytegeler/cj5adbyws0g7l2sqnl74tvzoa';
  window.maps = [];

  createMap = function(id) {
    var map = new mapboxgl.Map({
      container: id,
      style: styleURI,
      zoom: 3,
      center: [-95.7129, 37.0902]
    });
    map.scrollZoom.disable();
    maps[id] = map;
    placeMarkers(id)
  };

  placeMarkers = function(id) {
    map = maps[id];
    $map = $('#'+id)
    var markers = $map.attr('data-markers');
    if(!markers) {
      return false;
    }
    markers = JSON.parse(markers);
    for(var i = 0; i < markers.length; i++) {
      console.log(markers[i]);
      var lng = markers[i].lng;
      var lat = markers[i].lat;
      var marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    }
  } 


  $('.exploratory-map').each(function(i, map) {
    var id = 'ex-map-'+i;
    $(map).attr('id',id);
    createMap(id)
  });


  
});
