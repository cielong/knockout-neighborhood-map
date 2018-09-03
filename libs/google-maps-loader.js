"use strict";
let googleMapsLoadedDeferred = null;

define(['jquery', 'constants',],function($, constants) {

    if(!googleMapsLoadedDeferred) {

        googleMapsLoadedDeferred = $.Deferred();

        window.googleMapsLoaded = function() {
            googleMapsLoadedDeferred.resolve(google.maps);
        };

        require([`${constants.GOOGLE_MAPS_URL}?key=${constants.GOOGLE_MAPS_API_KEY}&v=3&callback=googleMapsLoaded`, ],
            function(){},
            function() {
                googleMapsLoadedDeferred.reject();
        });

    }

    return googleMapsLoadedDeferred.promise();

});
