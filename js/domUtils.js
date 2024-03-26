import { handleMarkerClick } from "./eventHandlers.js";

export const removeMarkers = () => {
    const markers = document.querySelectorAll(".marker");
    markers.forEach(marker => marker.remove());
}

export const removePopups = () => {
    const popups = document.querySelectorAll(".mapboxgl-popup");
    popups.forEach(popup => popup.remove());
}

export const emptyContent = () => {
    removeMarkers();
    removePopups();
    document.querySelector("#concerts").replaceChildren();
}

export const outputVenuesToMap = venuesArray => {
    venuesArray.forEach((venue) => {
        if (venue.longitude && venue.latitude){
            const el = document.createElement('div');
            el.className = 'marker';
            el.setAttribute('data-id', venue.id);
            const venueMarker = new mapboxgl.Marker(el);
            venueMarker.setLngLat([venue.longitude, venue.latitude]);
            venueMarker.addTo(map);
            const popup = new mapboxgl.Popup()
                .setHTML('<p>'+ venue.name + '</p>');
            venueMarker.setPopup(popup);
        }
    });
    const markers = document.querySelectorAll('.marker');
    markers.forEach(marker => marker.addEventListener('click', event => handleMarkerClick(event, venuesArray)));
}
