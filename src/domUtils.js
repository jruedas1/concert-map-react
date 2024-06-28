import {handleGenreSelection, handleMarkerClick, handleVenueSelection, handleYearSelection} from "./eventHandlers.js";
import {fetchGenreData} from "./dataAccess.js";

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

export const emptyConcertInfo = () => {
    document.querySelector("#concerts").replaceChildren();
}

export const emptyVenueInfo = () => {
    document.querySelector("#venues").replaceChildren();
}

/*
* Utility function to combine removing markers,
* popups, venue data, and concert data from page
* */
export const emptyContent = () => {
    removeMarkers();
    removePopups();
    emptyConcertInfo();
    emptyVenueInfo();
}

/*
* When the explore search is selected,
* the simple search filters have to be hidden
* */
export const hideSimpleSearchFilters = () => {
    const simpleSearchFilters = [
        document.querySelector("#decades"),
        document.querySelector("#decade-list"),
        document.querySelector("#years"),
        document.querySelector("#year-list")
    ];
    simpleSearchFilters.forEach(filter => {
       if (!filter.classList.contains('hidden')) filter.classList.add('hidden');
    });
}

/*
* When the simple search is selected,
* the explore search filters have to be hidden
* */
export const hideExploreSearchFilters = () => {
    const exploreSearchFilters = [
        document.querySelector("#year-range"),
        document.querySelector("#year-slider-container"),
        document.querySelector("#genres"),
        document.querySelector("#genre-list")
    ];
    exploreSearchFilters.forEach(filter =>{
       if (!filter.classList.contains('hidden')) filter.classList.add('hidden');
    });
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
export const outputVenuesToMap = (map, venuesArray) => {
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

export const outputVenueToMap = (map, venue) => {
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
}

/*
* This method runs when the page first loads
* It dynamically generates the genre list based on
* the master genres in the genres data
* Once the genres list is generated, it is output to the DOM,
* but it remains hidden until the user interacts
* with the genres filter
*
* this function needs a reference to the MapBox map object
* this is because an event handler gets attached to each
* genre DOM element, and when the user clicks on these elements,
* the venues get output to the map
*/


export const generateGenreList = async (map) => {
    const genreList = document.querySelector("#genre-list");
    const genreData = await fetchGenreData();
    for (const genre of genreData){
        const genreDiv = document.createElement('div');
        genreDiv.innerHTML = `
             <div class="genre filter-option" data-id="${genre['id']}">
                 <h3>${genre['name'].toUpperCase()}</h3>
             </div>
            `;
        genreDiv.addEventListener('click', event => handleGenreSelection(event, map));
        genreList.appendChild(genreDiv);
    }
}

export const generateYearList = (decade, map) => {
    const yearList = document.querySelector("#year-list");
    yearList.innerHTML = '';
    const newYears = [];
    for (let i = decade; i < decade + 10; i++){
        const yearDiv = document.createElement('div');
        yearDiv.classList.add('year', 'filter-option');
        yearDiv.dataset.id = i.toString();
        yearDiv.innerHTML = `<h3>${i.toString()}</h3>`;
        yearDiv.addEventListener('click', handleYearSelection);
        newYears.push(yearDiv);
    }
    yearList.replaceChildren(...newYears);
}

// This function generates concert information
// for output to the page
// This is where you would edit the html for the concert data
export const generateConcertHTML = venuesArray => {
    let concertsOutput = '';
    venuesArray.forEach(venue => {
        // generate the html for the concerts list
        venue.concerts.forEach(concert => concertsOutput+= `
            <div class="concert-info">
                <h3>${concert.Artist_Formula}</h3>
                <p>${concert.Venue}</p>
                <p>${concert.Month} ${concert.Day} ${concert.Year}</p>
            </div>
        `);
    });
    return concertsOutput;
}

export const generateOneVenuesConcerts = venue => {
    let concertOutput = '';
    venue.concerts.forEach(concert => concertOutput+=`
        <div class='concert-info'>
             <h3>${concert.Artist_Formula}</h3>
             <p>${concert.Month} ${concert.Day} ${concert.Year}</p>
        </div>
    `);
    return concertOutput;
}

export const generateOneConcertHTML = concert => {
    const concertDiv = document.createElement('div');
    concertDiv.classList.add('concert-info');
    const artistHeading = document.createElement('h3');
    artistHeading.innerText = concert.Artist_Formula;
    const venueOutput = document.createElement('p');
    venueOutput.innerText = concert.Venue;
    const dateOutput = document.createElement('p');
    dateOutput.innerText = `${concert.Month} ${concert.Day} ${concert.Year}`;
    concertDiv.appendChild(artistHeading);
    concertDiv.appendChild(venueOutput);
    concertDiv.appendChild(dateOutput);
    return concertDiv;
}

/*
* The venues list that gets output to the page
* has a click event handler attached to each venue div
* to manage this, instead of generating text html
* we use document.createElement and return a nodeList
* */
export const generateVenuesList = venuesArray => {
    const venuesOutput = [];
    venuesArray.forEach(venue => {
        // create the venue div
        const venueDiv = document.createElement('div');
        // and the 'venue' class and the data-id attribute set to the venue id
        venueDiv.classList.add('venue');
        venueDiv.dataset.id = venue.id;
        // create the h3 element with the name of the venue
        const venueHeading = document.createElement('h3');
        venueHeading.innerText = venue.name;
        // put the heading in the venue div
        venueDiv.appendChild(venueHeading);
        // add the click handler to the venue div
        venueDiv.addEventListener('click', event => handleVenueSelection(event, venue.id, venuesArray));
        // add the venue div to the list
        venuesOutput.push(venueDiv);
    });
    return venuesOutput;
}

/*
*  This function toggles the visibility of
*  the decade, year, and genre lists
* */
export const toggleVisibility = (event, elementReference) => {
    elementReference.classList.toggle('hidden');
}

/*
* Hide an element if it's not hidden
* */
export const hideElement = (event, elementReference) => {
    if (!elementReference.classList.contains('hidden')){
        elementReference.classList.add('hidden');
    }
}

/*
* Show an element if it's hidden
* */
export const showElement = (event, elementReference) => {
    if (elementReference.classList.contains('hidden')){
        elementReference.classList.remove('hidden');
    }
}

