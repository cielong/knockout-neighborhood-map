define(['LocationMarkersPool'],function(locationMarkersPool){
    return {
        map: null,

        bounds: null,

        infoWindow: null,

        markersPool: null,

        start: function(){

            this.map = new google.maps.Map(document.getElementById('google-map'), {
                zoom: 13
            });

            this.infoWindow = new google.maps.InfoWindow({
                maxWidth: null
            });

            this.bounds = new google.maps.LatLngBounds();

            this.markersPool = new locationMarkersPool(this);
        }
    }
});
