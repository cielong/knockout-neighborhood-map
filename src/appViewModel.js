define(['app', 'Knockout', 'jquery', 'geohash', 'Event', 'constants', 'utils'],
    function(app, ko, $, geohash, Event, constants, utils) {
    return function appViewModel() {
        let self = this;

        // Properties
        self.currentStatus = ko.observable("");
        self.currentLocation = ko.observable(null);
        self.searchLocation = ko.observable(null);
        self.nearByEvents = ko.observableArray([]);
        self.categories = ko.pureComputed(function() {
            let categories = self.nearByEvents().map((event) => event.categories);
            return Array.from(new Set([].concat(...categories)));
        }, self);
        self.selectedCategories = ko.observableArray();

        self.toggleCategories = function(category) {
            console.log(self.selectedCategories());
            if (self.selectedCategories.indexOf(category) !== -1) {
                self.selectedCategories.remove(category);
            } else {
                self.selectedCategories.push(category);
            }
            console.log(self.selectedCategories());
        };

        self.filter = ko.observable('');
        self.filteredEvents = ko.computed(function () {
            const filter = self.filter().toLowerCase();
            let events = ko.utils.arrayFilter(self.nearByEvents(), function (event) {
                const visible = event.title.toLowerCase().indexOf(filter) >= 0 &&
                    self.selectedCategories.indexOf(event.categories[0]) !== -1;
                if (visible) {
                    event.visible(true);
                } else {
                    event.visible(false);
                }
                app.markersPool.toggleMarker(event);
                return visible;
            });
            if (events.length === 0) {
                self.currentStatus("Sorry, no events has been found.");
            }
            return events;
        }, self);

        // Methods
        self.init = function () {
            self.initGeoLocation();
        };

        self.initGeoLocation = function () {
            console.log("Init GeoLocation");
            self.currentStatus("Getting Current Location.");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    const currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log(app.markersPool);
                    app.markersPool.setCurrentLocation(new google.maps.LatLng(currentPosition));
                    self.currentLocation(currentPosition);
                    self.searchLocation(currentPosition);
                    self.loadNearByEvents();
                }, function () {
                    console.warn("navigator.geolocation is not available.");
                    utils.showError("navigator.geolocation is not available.");
                }, {maximumAge: 600000});
            } else {
                console.warn("navigator.geolocation is not available.");
                utils.showError("navigator.geolocation is not available.");
            }
        };

        self.loadNearByEvents = function() {
            console.log("Loading nearby events.");
            self.currentStatus("Loading NearBy Events.");
            const geopoint = geohash.encode(self.searchLocation().lat, self.searchLocation().lng, 9);
            const url = `${constants.TICKET_MASTER_URL}?apikey=${constants.TICKET_MASTER_API_KEY}`+
                `&geoPoint=${geopoint}&radius=50&keyword=`;
            $.ajax({
                url: url,
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    let events = response["_embedded"].events;
                    events = filterEvents(events);
                    // console.log(events);
                    for (let i = 0; i < events.length; i++) {
                        //console.log(events[i]);
                        let event = new Event(events[i]);
                        self.nearByEvents.push(event);
                    }
                    self.selectedCategories(self.categories());
                },
                error: function (err) {
                    console.log(err);
                    utils.showError("Failed to load nearby events.");
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