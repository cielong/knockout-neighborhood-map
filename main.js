"use strict";
require.config({
    paths:{
        require: 'libs/require',
        jquery: 'libs/jquery',
        underscore: "libs/underscore",
        GoogleMapsLoader: 'libs/google-maps-loader',
        geohash: 'libs/latlon-geohash',
        Knockout: 'libs/knockout-3.4.2',
        utils: 'src/utils',
        constants: 'constants',
        Event: 'src/Event',
        LocationMarkersPool: 'src/LocationMarkersPool',
        appViewModel: 'src/appViewModel',
        app: 'src/app',
    },
    shim: {
        "underscore": {
            exports: "_",
        },
    },
});

require(['GoogleMapsLoader','app', 'Knockout', 'appViewModel', 'utils'],
    function(GoogleMapsLoader, app, ko, AppViewModel, utils){
        GoogleMapsLoader.done(function(){
            app.start();
            ko.applyBindings(new AppViewModel());
        }).fail(function(){
            console.error("ERROR: Google maps library failed to load");
            utils.showError("ERROR: Google maps library failed to load");
        });
});
