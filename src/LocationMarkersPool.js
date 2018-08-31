/**
 * @description: an helper for creating markers on google maps while
 * join events on the same location
 * @param {object} app: object contains preloaded google map loader
 */
define([], function() {
    return function LocationMarkersPool(app) {
        let self = this;

        // Properties
        self.markersPool = new Map();
        self.marker2events = new Map();

        // Methods
        self.setCurrentLocation = function(location) {
            let locationUrlValue = location.toUrlValue();
            if (!self.markersPool.has(locationUrlValue)) {
                self.markersPool.set(locationUrlValue, new google.maps.Marker({
                    position: location,
                    map: app.map
                }))
            }
            app.bounds.extend(location);
            app.map.fitBounds(app.bounds);
        };

        self.createMarker = function(event) {
            let events = null;
            let locationUrlValue = event.location.toUrlValue();
            if (self.markersPool.has(locationUrlValue)) {
                let marker = self.markersPool.get(locationUrlValue);
                events = self.marker2events.get(marker);
                events.push(event);
            } else {
                self.markersPool.set(locationUrlValue, new google.maps.Marker({
                    position: event.location,
                }));
                events = [event];
            }
            event.marker = self.markersPool.get(locationUrlValue);
            self.marker2events.set(event.marker, events);
            event.marker.addListener('click', function () {
                self.openInfoWindow(this);
            });
            self.toggleMarker(event);
            return self.markersPool.get(locationUrlValue);
        };

        self.toggleMarker = function(event) {
            let locationUrlValue = event.location.toUrlValue();
            let marker = self.markersPool.get(locationUrlValue);
            let events = self.marker2events.get(marker);
            const visible = events.some((event) => event.visible());
            let map = app.map;
            let bounds = app.bounds;
            if (!visible) {
                marker.setMap(null);
            } else {
                marker.setMap(map);
                bounds.extend(event.location);
            }
            map.fitBounds(bounds);
        };

        self.openInfoWindow = function(marker) {
            console.log("Pools openInfoWindow");
            let map = app.map;
            let infoWindow = app.infoWindow;
            let events = self.marker2events.get(marker);
            let content = self.infoWindowTemplate(events);
            if (infoWindow.marker !== marker) {
                infoWindow.marker = marker;
                console.log(content);
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
                infoWindow.addListener('closeclick', function () {
                    infoWindow.marker = null;
                });
            }
        };

        self.closeInfoWindow = function() {
            let infoWindow = app.infoWindow;
            if (infoWindow.marker !== null) {
                infoWindow.marker = null;
            }
        };

        // templates
        self.infoWindowTemplate = function(events) {
            let content = "<div class='gm-infoWindow container'><div class='row no-gutters'><div class='col-12'><ul class='list-group list-group-flush'>";
            for (let i=0; i<events.length; i++) {
                if (events[i].visible()) {
                    content += `<li class="list-group-item d-flex p-1">` +
                        `<div class="col-4 p-1">` +
                        `<img class="rounded" src="${events[i].imageUrl}"/>` +
                        `</div>` +
                        `<div class="col-8 p-1">` +
                        `<h6 class="event-title">${events[i].title}</h6>` +
                        `<p>` +
                        `<i class="far fa-calendar" aria-hidden="true"></i><span class="event-text">${events[i].dates.join(', ')}</span>` +
                        `<br/>` +
                        `<i class="fas fa-map-marker-alt" aria-hidden="true"></i><span class="event-text">${events[i].locationLiteral}</span>` +
                        `<br/>` +
                        `<i class="far fa-hand-point-right"></i><a class="event-text" target="_blank" href="${events[i].url}">Find more</a>` +
                        `</p></div></li>`;
                }
            }
            content += "</ul></div></div></div>";
            return content;
        };

    }
});