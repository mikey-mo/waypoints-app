function initMap(){
    navigator.geolocation.getCurrentPosition(success);

    function success(pos) {
        var crd = pos.coords;
        var latLng = {lat:crd.latitude, lng:crd.longitude}
        var options = {
            zoom: 15,
            center: latLng
        }
        var map = new google.maps.Map(document.getElementById('map'), options);

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: 'Current Location'
        });
      }

    var infoWindow = new google.maps.InfoWindow({ content: "<h1>Hello World 2</h1>"})

}