var google_maps_loaded_def = null;

define(['jquery', 'constants'],function($, constants) {

    if(!google_maps_loaded_def) {

        google_maps_loaded_def = $.Deferred();

        window.google_maps_loaded = function() {
            google_maps_loaded_def.resolve(google.maps);
        };

        require([`${constants.GOOGLE_MAPS_URL}?key=${constants.GOOGLE_MAPS_API_KEY}&v=3&callback=google_maps_loaded`],
            function(){},
            function(err) {
                google_maps_loaded_def.reject();
        });

    }

    return google_maps_loaded_def.promise();

});
