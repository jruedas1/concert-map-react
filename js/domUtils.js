import { handleMarkerClick } from "./eventHandlers.js";
import {fetchYear} from "./dataAccess.js";

/*
    Removes markers from map
    Note that this uses a custom class reference
    The map uses custom markers and the .marker class
    is added when the markers are created. It is
    NOT a default Mapbox class
 */
//
export const removeMarkers = () => {
    const markers = document.querySelectorAll(".marker");
    markers.forEach(marker => marker.remove());
}

/*
* Removes popups from map.
* Note that this uses a default Mapbox class, .mapboxgl-popup
* */
export const removePopups = () => {
    const popups = document.querySelectorAll(".mapboxgl-popup");
    popups.forEach(popup => popup.remove());
}

/*
* Utility function to combine removing markers,
* popups, and concert data from page
* */
export const emptyContent = () => {
    removeMarkers();
    removePopups();
    document.querySelector("#concerts").replaceChildren();
}

/*
* Function to output venue data to map.
* This function takes an array of venue objects
* 1. Loop over the array of venue objects
* 2. If the venue object contains valid long and lat,
*    create a custom div:
*       a. Create a div for the marker
*       b. Add the .marker class to the div
*          Note that the svg representing the marker is set in
*          the css file under the .marker class rules
*       c. Set the data-id attribute corresponding to the venue
*       d. Create a new mapbox marker using the
*          custom div we just created
*       e. Set the longitude and latitude of the marker
*       f. Add the marker to the map
*       g. Create a popup with the venue's name
*       h. Add the popup to the marker.
* 3. Once the markers have been added, obtain a reference to them
* 4. Loop over the markers and add the event handlers to detect user clicks
* */
export const outputVenuesToMap = venuesArray => {
    console.log(venuesArray);
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

export const detectYearAndOutputYearData = async () => {
    let selectedYear = document.querySelector("#year-selector").value;
    const dataOnSelectedYear = await fetchYear(selectedYear);
    const venues = dataOnSelectedYear.venues;
    outputVenuesToMap(venues);
}