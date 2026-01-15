import mapboxgl from "mapbox-gl";

export const outputVenuesToMap = (map, venuesArray, setSelectedVenue, setHoveredMarkerVenueId) => {
    venuesArray.forEach((venue) => {
        outputVenueToMap(map, venue, setSelectedVenue, setHoveredMarkerVenueId);
    });
    const markers = document.querySelectorAll('.marker');
    markers.forEach(marker => {
        const venueId = marker.dataset.id;
    });
}

export const outputVenueToMap = (map,
                                 venue,
                                 setSelectedVenue,
                                 setHoveredMarkerVenueId,
                                 isMobile,
                                 setSingleVenueMode
) => {
    let venueLongitude = null;
    let venueLatitude = null;
    if (venue.geometry) {
        venueLongitude = venue.geometry.coordinates[0];
        venueLatitude = venue.geometry.coordinates[1];
    }

    const address = venue.properties.address;
    const cityStateZip = `${venue.properties.city}, TX ${venue.properties.zip}`;
    if (venueLongitude && venueLatitude){
        const el = document.createElement('div');
        el.className = 'marker';
        el.setAttribute('data-id', venue.properties.id);
        const venueMarker = new mapboxgl.Marker(el);
        venueMarker.setLngLat([venueLongitude, venueLatitude]);
        venueMarker.addTo(map);
        const popup = new mapboxgl.Popup({
            closeButton: false,
            offset: [30, 0],
            anchor: 'left'
        })
            .setHTML(`
                            <h2>${venue.properties.name}</h2>
                            <p>${address}</p>
                            <p>${cityStateZip}</p>
                          `);
        venueMarker.setPopup(popup);

        // on marker click, reset venue state to show concert list
        el.addEventListener("click", () => {
            setSelectedVenue(venue);
            if (isMobile) setSingleVenueMode(true);
        });

        // Show popup on hover
        el.addEventListener('mouseenter', () => {
            el.classList.remove('marker');
            el.classList.add('y-marker');
            popup.addTo(map);
            popup.setLngLat([venueLongitude, venueLatitude]);
            setHoveredMarkerVenueId(venue.properties.id);
        });

        // Hide popup when leaving the marker
        el.addEventListener('mouseleave', () => {
            el.classList.remove('y-marker');
            el.classList.add('marker');
            popup.remove();
            setHoveredMarkerVenueId(null);
        });

        el.addEventListener('blur', () => {
            el.classList.remove('y-marker');
            el.classList.add('marker');
            popup.remove();
            setHoveredMarkerVenueId(null);
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

export const findMarkerById = (map, id) => {
    return map['_container'].querySelector(`[data-id='${id.toString()}']`);
}

export const highlightMarker = marker => {
    marker.classList.remove('marker');
    marker.classList.add('y-marker');
}

export const deHighlightMarker = marker => {
    marker.classList.remove('y-marker');
    marker.classList.add('marker');
}

export const findHighlightedMarkers = (map) => {
    return map['_container'].querySelectorAll('.y-marker');
}

export const findAndDeHighlightMarkers = (map) => {
    const highlightedMarkers = findHighlightedMarkers(map);
    if (highlightedMarkers.length !== 0) highlightedMarkers.forEach(marker => deHighlightMarker(marker));
}

export const findAndHighlightMarker = (map, venueId) => {
    const marker = findMarkerById(map, venueId);
    if (marker) highlightMarker(marker);
}



