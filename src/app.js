define([],function(){
    return {
        map: null,
        bounds: null,
        infoWindow: null,

        start: function(){
            const center = new google.maps.LatLng(37.4419, -122.1419);

            this.map = new google.maps.Map(document.getElementById('google-map'), {
                zoom: 13,
                center: center,
            });

            this.infoWindow = new google.maps.InfoWindow();

            this.bounds = new google.maps.LatLngBounds();
        }
    }
});
