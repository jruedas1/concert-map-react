const fetchVenues = async () => {
    const venues = await fetch('http://localhost:3001/venues');
    return await venues.json();
}



const updateVenue = async (id, venue) => {
    try {
        const url = `http://localhost:3001/venues/${id}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venue)
        };
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    const venues = await fetchVenues();

    venues.forEach((venue) => {
       if (venue.longitude && venue.latitude){
           const venueMarker = new mapboxgl.Marker();
           venueMarker.setLngLat([venue.longitude, venue.latitude]);
           venueMarker.addTo(map);
           const popup = new mapboxgl.Popup()
               .setHTML('<p>'+ venue.name + '</p>');
           venueMarker.setPopup(popup);
       } else {
           console.log(venue);
           const searchString = `=${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`;
           geocode(searchString, MAPBOX_API_KEY).then(coords => {
               if (coords){
                   const venueMarker = new mapboxgl.Marker();
                   venueMarker.setLngLat([coords[0], coords[1]]);
                   venueMarker.addTo(map);
                   const popup = new mapboxgl.Popup()
                       .setHTML('<p>'+ venue.name + '</p>');
                   venueMarker.setPopup(popup);
                   venue.longitude = coords[0];
                   venue.latitude = coords[1];
                   updateVenue(venue.id, venue);
               }
           });
       }
    });
})();