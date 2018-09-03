"use strict";
define(['LocationMarkersPool', ],function(LocationMarkersPool){
    return {
        map: null,

        bounds: null,

        infoWindow: null,

        markerLayer: null,

        markersPool: null,

        fixInfoWindow: null,

        start: function(){

            this.map = new google.maps.Map(document.getElementById('google-map'), {
                zoom: 13,
            });

            this.infoWindow = new google.maps.InfoWindow({
                maxWidth: 250,
            });

            this.bounds = new google.maps.LatLngBounds();

            this.markerLayer = new google.maps.OverlayView();
            this.markerLayer.draw = function() {
                this.getPanes().markerLayer.id = "markerLayer";
            };
            this.markerLayer.setMap(this.map);

            this.fixInfoWindow = false;

            this.markersPool = new LocationMarkersPool(this);
        },
    };
});
