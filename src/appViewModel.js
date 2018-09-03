"use strict";
/**
 * @description: app ViewModel
 */
define(["app", "Knockout", "jquery", "underscore", "geohash", "Event", "constants", "utils",],
    function(app, ko, $, _, geohash, Event, constants, utils) {
    return function appViewModel() {
        let self = this;

        // Properties
        self.currentStatus = ko.observable("");

        /*
        currentLocation: the current location
        searchLoaction: location used to get nearbyEvents, potentially enhance later
                        with search ui to enable search other places
        nearbyEvents: events near the searchLocation
         */
        self.currentLocation = null;
        self.searchLocation = ko.observable(null);
        self.nearbyEvents = ko.observableArray([]);

        /*
        Available categories to filter events
         */
        self.categories = constants.CATEGORIES;
        self.selectedCategories = ko.observableArray(self.categories);

        /**
         * @description: Filter events based on a filter string and accordingly changing
         * markers showing on the map
         */
        self.filter = ko.observable("");
        self.filteredEvents = ko.computed(function () {
            const filter = self.filter().toLowerCase();
            let events = ko.utils.arrayFilter(self.nearbyEvents(), function (event) {
                event.visible = event.title.toLowerCase().indexOf(filter) >= 0 &&
                    self.selectedCategories.indexOf(event.categories[0]) !== -1;
                app.markersPool.toggleMarker(event);
                return event.visible;
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


        /**
         *@description: Get current location using navigator.geolocation
         * if unavailable, throw error message
         */
        self.initGeoLocation = function () {
            console.log("Init GeoLocation");
            self.currentStatus("Getting current location.");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    self.currentLocation = new google.maps.LatLng({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    app.markersPool.setCurrentLocation(self.currentLocation);
                    self.searchLocation(self.currentLocation);
                    self.loadNearbyEvents();
                }, function () {
                    console.warn("navigator.geolocation is not available.");
                    utils.showError("navigator.geolocation is not available.");
                }, {maximumAge: 600000,});
            } else {
                console.warn("navigator.geolocation is not available.");
                utils.showError("navigator.geolocation is not available.");
            }
        };

        /**
         * @description: Loading nearby events through a ajax call from TicketMaster API
         */
        self.loadNearbyEvents = function() {
            console.log("Loading nearby events.");
            self.currentStatus("Loading nearby events.");
            const geopoint = geohash.encode(self.searchLocation().lat(), self.searchLocation().lng(), 9);
            const url = `${constants.TICKET_MASTER_URL}?` +
                `apikey=${constants.TICKET_MASTER_API_KEY}`+
                `&geoPoint=${geopoint}&radius=50&keyword=`;
            $.ajax({
                url: url,
                dataType: "json",
            }).then(
                (response) => {
                    let events = response._embedded.events;
                    filterEvents(events).forEach(
                        function(event) {
                            self.nearbyEvents.push(new Event(event));
                        }
                    );
                }
            ).catch(() => {
                //utils.showError("Sorry, load nearby events failed");
                utils.showWarning("Caution! Load nearby events failed! You are now watching only fake data.");
                $.getJSON("./assets/data/fakeData.json", (response) => {
                    let events = response._embedded.events;
                    filterEvents(events).forEach((event) => {
                        self.nearbyEvents.push(new Event(event));
                    });
                });
            }).catch(() => {
                utils.showError("Network failed")
            });
        };

        let filterEvents = function(events) {
            events = _.uniq(events, false, (event) => event.name);
            return events;
        };


        self.toggleCategories = function(category) {
            if (self.selectedCategories.indexOf(category) !== -1) {
                self.selectedCategories.remove(category);
            } else {
                self.selectedCategories.push(category);
            }
        };

        // Initialize
        self.init();
    };
});