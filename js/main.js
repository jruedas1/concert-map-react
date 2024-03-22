import { fetchVenues, fetchVenue, updateVenue} from "./concertsDataAccess.js";

const handleMarkerClick = async event => {
    const venueId = event.target.dataset.id;
    const venue = await fetchVenue(venueId);
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

(async () => {
    let selectedVenue = "";
    let selectedYear = 1970;
    let selectedDecade = "";

    const venues = await fetchVenues();

    venues.forEach((venue) => {
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
    markers.forEach(marker => marker.addEventListener('click', handleMarkerClick));
})();