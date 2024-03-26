import { fetchData, fetchYear } from "./concertsDataAccess.js";


// technique for setting up callback with extra parameters:
// https://stackoverflow.com/questions/10000083/javascript-event-handler-with-parameters
const handleMarkerClick =  (event, venuesArray) => {
    const venueId = parseInt(event.target.dataset.id);
    const venue = venuesArray.filter((venue) => venue.id === venueId)[0];
    const concerts = venue.concerts;
    let concertsOutput = '';
    concerts.forEach(concert => concertsOutput+= `
            <div>
                <h3>${concert.Artist_Formula}</h3>
                <p>${concert.Venue} ${concert.Month} ${concert.Day} ${concert.Year}</p>
            </div>
        `);
    document.querySelector("#concerts").innerHTML = concertsOutput;
}

const removeMarkers = () => {
    const markers = document.querySelectorAll(".marker");
    markers.forEach(marker => marker.remove());
}

const removePopups = () => {
    const popups = document.querySelectorAll(".mapboxgl-popup");
    popups.forEach(popup => popup.remove());
}

const emptyContent = () => {
    removeMarkers();
    removePopups();
    document.querySelector("#concerts").replaceChildren();
}

const yearSelector = document.querySelector("#year-selector");
const handleYearSelection = async event => {
    emptyContent();
    console.log(event.target.value);
    const dataOnSelectedYear = await fetchYear(event.target.value);
    const venues = dataOnSelectedYear.venues;
    outputVenuesToMap(venues);
}
yearSelector.addEventListener('change', handleYearSelection);

const outputVenuesToMap = venuesArray => {
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

(async () => {
    removeMarkers();
    let selectedYear = document.querySelector("#year-selector").value;

    const dataOnSelectedYear = await fetchYear(selectedYear);
    const venues = dataOnSelectedYear.venues;
    outputVenuesToMap(venues);

})();