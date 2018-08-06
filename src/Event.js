define(['app', 'Knockout'], function(app, ko) {
    return function Event(event) {
        let self = this;

        // Properties

        // Methods
        self.parseEvent = function() {
            self.url = event.url;
            self.title = event.name;
            self.distance = event.distance;
            self.desciption = event.desciption;
            self.dates = event.dates.map((date) => date.start.localDate);
            if (event["images"].length !== 0) {
                self.imageUrl = event["images"][0]["url"];
            }
            if (event["_embedded"] !== null) {
                let embeddeds = event["_embedded"];
                if (embeddeds["venues"] !== null && embeddeds["venues"].length !== 0) {
                    let venue = embeddeds["venues"][0];
                    self.location = {
                        lat: parseFloat(venue.location.latitude.toString()),
                        lng: parseFloat(venue.location.longitude.toString())
                    };
                    self.locationLiteral = `${venue.address.line1}, ${venue.city.name}, ${venue.state.name}`;
                }
            }
            if (self.location !== null) {
                self.marker = new google.maps.Marker({
                    position: self.location,
                    title: self.title
                });
            }
            self.visible = ko.observable(true);
            self.fixInfowindow = ko.observable(false);
            console.log(self.locationLiteral);
        };

        self.toggleMarker = function() {
            let map = app.map;
            let bounds = app.bounds;
            if (self.visible()) {
                self.marker.setMap(map);
                bounds.extend(self.location);
            } else {
                self.marker.setMap(null);
            }
            map.fitBounds(bounds);
        };

        self.setInfoWindow = function() {
            self.fixInfowindow(true);
            self.openInfoWindow();
        };

        self.openInfoWindow = function() {
            let map = app.map;
            let infoWindow = app.infoWindow;
            if (infoWindow.marker !== self.marker) {
                infoWindow.marker = self.marker;
                infoWindow.setContent('<div>' + self.marker.title + '</div>');
                infoWindow.open(map, self.marker);
                infoWindow.addListener('closeclick', function () {
                    self.fixInfowindow(false);
                    infoWindow.marker = null;
                });
            }
        };

        self.closeInfoWindow = function() {
            let infoWindow = app.infoWindow;
            if (infoWindow.marker !== null) {
                if (!self.fixInfowindow()) {
                    infoWindow.close();
                }
                infoWindow.marker = null;
            }
        };

        self.showLoading = function() {
            return true;
        };

        // Initialize
        self.parseEvent();

        self.marker.addListener('click', function () {
            self.openInfoWindow();
        });

        self.marker.addListener('dblclick', function () {
            self.closeInfoWindow();
        });
    }
});