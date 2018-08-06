define(['app', 'Knockout', 'jquery', 'geohash', 'Event', 'constants'],
    function(app, ko, $, geohash, Event, constants) {
    return function appViewModel() {
        let self = this;

        // Default Value
        const DEFAULT_LOCATION = {
            lat: 40.7713024,
            lng: -73.9632393
        };

        // Properties
        self.currentLocation = ko.observable(null);
        self.searchLocation = ko.observable(null);
        self.nearByEvents = ko.observableArray([]);

        self.filter = ko.observable('');
        self.filteredEvents = ko.computed(function () {
            const filter = self.filter().toLowerCase();
            return ko.utils.arrayFilter(self.nearByEvents(), function (event) {
                const visible = event.title.toLowerCase().indexOf(filter) >= 0;
                if (visible) {
                    event.visible(true);
                } else {
                    event.visible(false);
                }
                event.toggleMarker();
                return visible;
            });
        }, self);

        // Methods
        self.init = function () {
            self.initGeoLocation();
        };

        self.initGeoLocation = function () {
            let map = app.map;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    const currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(currentPosition);
                    self.currentLocation(currentPosition);
                    self.searchLocation(currentPosition);
                    self.loadNearByEvents();
                }, function () {
                    console.warn("navigator.geolocation is not available.");
                    map.setCenter(DEFAULT_LOCATION)
                }, {maximumAge: 60000});
                //showLoadingMessage('Retrieving your location...');
            } else {
                console.warn("navigator.geolocation is not available.");
                map.setCenter(DEFAULT_LOCATION)
            }
        };

        self.loadNearByEvents = function() {
            const geopoint = geohash.encode(self.searchLocation().lat, self.searchLocation().lng, 9);
            const url = `${constants.TICKET_MASTER_URL}?apikey=${constants.TICKET_MASTER_API_KEY}&geoPoint=${geopoint}&radius=50`;
            $.ajax({
                url: url,
                dataType: "json",
                success: function (response) {
                    let events = response["_embedded"].events;
                    events = filterEvents(events);
                    console.log(events);
                    for (let i = 0; i < events.length; i++) {
                        console.log(events[i]);
                        self.nearByEvents.push(new Event(events[i]));
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        };

        let filterEvents = function(events) {
            console.log(events);
            let uniqueEvents = {};
            for (let i=0; i < events.length; i++) {
                let event = events[i];
                event.dates = [event.dates];
                if (!uniqueEvents.hasOwnProperty(event.name)) {
                    uniqueEvents[event.name] = event;
                } else {
                    uniqueEvents[event.name].dates.push(event.dates[0]);
                }
            }
            return Object.values(uniqueEvents);
        };

        // Initialize
        self.init();
    };
});