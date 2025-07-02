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

export const outputVenueToMap = (map, venue, setSelectedVenue, setHoveredMarkerVenueId) => {
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
            .setHTML(`
                            <h2>${venue.name}</h2>
                            <p>${address}</p>
                            <p>${cityStateZip}</p>
                          `);
        venueMarker.setPopup(popup);

        // on marker click, reset venue state to show concert list
        el.addEventListener("click", () => {
            setSelectedVenue(venue);
        });

        // Show popup on hover
        el.addEventListener('mouseenter', () => {
            el.classList.remove('marker');
            el.classList.add('y-marker');
            popup.addTo(map);
            popup.setLngLat([venue.longitude, venue.latitude]);
            setHoveredMarkerVenueId(venue.id);
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



