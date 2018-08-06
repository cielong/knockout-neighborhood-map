require.config({
    paths:{
        require: 'libs/require',
        jquery: 'libs/jquery',
        GoogleMapsLoader: 'libs/google-maps-loader',
        geohash: 'libs/latlon-geohash',
        Knockout: 'libs/knockout-3.4.2',
        constants: 'constants',
        Event: 'src/Event',
        appViewModel: 'src/appViewModel',
        app: 'src/app'
    }
});

require(['GoogleMapsLoader','app', 'Knockout', 'appViewModel'],
    function(GoogleMapsLoader, app, ko, appViewModel){
        GoogleMapsLoader.done(function(){
            app.start();
            ko.applyBindings(new appViewModel());
        }).fail(function(){
            console.error("ERROR: Google maps library failed to load");
        });
});
