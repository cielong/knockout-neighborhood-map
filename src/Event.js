/**
 * @description Represents an event
 * @constructor parseEvent
 * @param {object} event, an JSON object returned by the TicketMaster API
 */
define(['app', 'Knockout'], function(app, ko) {
    return function Event(event) {
        let self = this;

        // Properties

        // Methods
        /**
         * @description: Parse JSON Object into an event object
         * work as a constructor
         */
        self.parseEvent = function() {
            self.url = event.url;
            self.title = event.name;
            self.distance = event.distance;
            self.desciption = event.desciption;
            self.categories = event.classifications.map((classification) => classification.segment.name);
            self.dates = [...new Set(event.dates.map((date) => date.start.localDate))];
            self.dates.sort();
            self.datesLiteral = self.dates.slice(0, 2).join(', ');
            if (event["images"].length !== 0) {
                self.imageUrl = event["images"][0]["url"];
            }
            if (event["_embedded"] !== null) {
                let embeddeds = event["_embedded"];
                if (embeddeds["venues"] !== null && embeddeds["venues"].length !== 0) {
                    let venue = embeddeds["venues"][0];
                    self.location = new google.maps.LatLng({
                        lat: parseFloat(venue.location.latitude.toString()),
                        lng: parseFloat(venue.location.longitude.toString())
                    });
                    self.locationLiteral = `${venue.address.line1}, ${venue.city.name}, ${venue.state.name}`;
                }
            }
            self.visible = ko.observable(true);
            self.fixInfowindow = ko.observable(false);
            self.marker = app.markersPool.createMarker(this);
        };

        /*
        Open/close infoWindow when mouse over, off or click the list item in the aside bar.
         */
        self.setInfoWindow = function() {
            self.fixInfowindow(true);
            self.openInfoWindow();
        };

        self.openInfoWindow = function() {
            console.log("Event's openInfoWindow");
            let map = app.map;
            let infoWindow = app.infoWindow;
            let content = self.infoWindowTemplate();
            if (infoWindow.marker !== self.marker) {
                infoWindow.marker = self.marker;
                infoWindow.setContent(content);
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

        /*
        InfoWindow content
         */
        self.infoWindowTemplate = function() {
            console.log("template");
            let content = "<div class='gm-infoWindow container'><div class='row no-gutters'><div class='col-12'><ul class='list-group list-group-flush'>";
            content += `<li class="list-group-item d-flex p-1">` +
                `<div class="col-4 p-1">` +
                `<img class="rounded img-infoWindow" src="${self.imageUrl}"/>` +
                `</div>` +
                `<div class="col-8 p-1">` +
                `<h6 class="event-title">${self.title}</h6>` +
                `<p>` +
                `<i class="far fa-calendar" aria-hidden="true"></i><span class="event-text">${self.dates.join(', ')}</span>` +
                `<br/>` +
                `<i class="fas fa-map-marker-alt" aria-hidden="true"></i><span class="event-text">${self.locationLiteral}</span>` +
                `<br/>` +
                `<i class="far fa-hand-point-right"></i><a class="event-text" target="_blank" href="${self.url}">Find more</a>` +
                `</p></div></li>`;
            content += "</ul></div></div></div>";
            return content;
        };

        // Initialize
        self.parseEvent();
    }
});