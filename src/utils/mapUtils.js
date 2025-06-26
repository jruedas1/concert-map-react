import mapboxgl from "mapbox-gl";

export const outputVenuesToMap = (map, venuesArray) => {
    venuesArray.forEach((venue) => {
        outputVenueToMap(map, venue);
    });
    const markers = document.querySelectorAll('.marker');
    markers.forEach(marker => {
        const venueId = marker.dataset.id;
        // marker.addEventListener('mouseover', event => handleMarkerMouseEnter(event, venueId));
        // marker.addEventListener('mouseout', event => handleMarkerMouseOut(event, venueId));
        // marker.addEventListener('click', event => handleMarkerClick(map, event, parseInt(venueId), venuesArray));
    });
}

export const outputVenueToMap = (map, venue) => {
    const address = venue.address;
    const cityStateZip = `${venue.city}, TX ${venue.zip}`;
    if (venue.longitude && venue.latitude){
        const el = document.createElement('div');
        el.className = 'marker';
        el.setAttribute('data-id', venue.id);
        const venueMarker = new mapboxgl.Marker(el);
        venueMarker.setLngLat([venue.longitude, venue.latitude]);
        venueMarker.addTo(map);
        const popup = new mapboxgl.Popup({
            closeButton: false,
            offset: [30, 0],
            anchor: 'left'
        })
            // .setHTML('<h2>'+ venue.name + '</h2>');
            .setHTML(`
                            <h2>${venue.name}</h2>
                            <p>${address}</p>
                            <p>${cityStateZip}</p>
                          `);
        venueMarker.setPopup(popup);

        // Show popup on hover
        el.addEventListener('mouseenter', () => {
            popup.addTo(map);
            popup.setLngLat([venue.longitude, venue.latitude]);
        });

        // Hide popup when leaving the marker
        el.addEventListener('mouseleave', () => {
            popup.remove();
        });

        el.addEventListener('blur', () => {
            popup.remove();
        });

        return venueMarker;
    }
}

export const removeMarkers = () => {
    const markers = document.querySelectorAll(".marker, .y-marker");
    markers.forEach(marker => marker.remove());
};

export const removePopups = () => {
    const popups = document.querySelectorAll(".mapboxgl-popup");
    popups.forEach(popup => popup.remove());
};

