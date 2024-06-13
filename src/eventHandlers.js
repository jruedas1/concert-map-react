import {
    emptyContent,
    generateConcertHTML,
    generateOneVenuesConcerts,
    generateVenuesList,
    generateYearList,
    outputVenuesToMap,
} from "./domUtils.js";
import {fetchYear, getVenuesForYearAndGenre} from "./dataAccess.js";

/* technique for setting up callback with extra parameters from:
 https://stackoverflow.com/questions/10000083/javascript-event-handler-with-parameters
 Note that the handler for reacting to clicks on map markers
 is set up in the same loop as when the markers are created.
 This is in the outputVenuesToMap() function in the DOM utils.
 Note that this handler takes an array of venues as well as an event object.
 To make this work, we set it like this:
 markers.forEach(marker => marker.addEventListener('click', event => handleMarkerClick(event, venuesArray)));
 NOT like this: addEventListener('click', handleMarkerClick)
 */
export const handleMarkerClick =  (event, venuesArray) => {
    // The venue id is stored as a data-id attribute value in the marker element
    const venueId = parseInt(event.target.dataset.id);
    // Loop over the filters to find the id match
    const venue = venuesArray.filter((venue) => venue.id === venueId)[0];
    // obtain a reference to that venue's concerts for the year displayed
    const concerts = venue.concerts;
    // empty out the div in which the concert data is displayed
    let concertsOutput = '';
    // generate the html for the concerts list
    concerts.forEach(concert => concertsOutput+= `
            <div class="concert-info">
                <h3>${concert.Artist_Formula}</h3>
                <p>${concert.Venue}</p>
                <p>${concert.Month} ${concert.Day} ${concert.Year}</p>
            </div>
        `);
    // output concerts info to the page
    document.querySelector("#concerts").innerHTML = concertsOutput;
}

// handler to respond to user interaction with decade selector
export const handleDecadeSelection = async (event, map) => {
    /*
    * Get the decade selected by the user and generate the
    * list of years corresponding to that decade
    * */
    const selectedDecade = parseInt(event.target.dataset.id);
    generateYearList(selectedDecade, map);

    /*
    * Change the text from "select a decade"
    * to the selected decade
    * */
    const decadeFilter = event.currentTarget.parentElement.previousElementSibling;
    decadeFilter.querySelector("h3").innerText = selectedDecade.toString() + 's';

    /*
    * Show the edit button
    * Show the years filter
    * */
    decadeFilter.querySelector(".edit").classList.remove('hidden');
    decadeFilter.nextElementSibling.nextElementSibling.classList.remove('hidden');

    /* Close the decade list by triggering the toggleVisibility event*/
    decadeFilter.click();
}

// Handler for user interaction with year selection
export const handleYearSelection = async (event, map) => {
    /*  whenever a year is selected, remove
        any markers and popups displayed on the map
        and remove any concert info currently displayed
     */
    emptyContent();
    // Retrieve the data on the selected year
    const clickedH3 = event.target.localName === 'h3';

    const selectedYear = clickedH3 ? event.target.innerText : event.target.dataset.id;
    const dataOnSelectedYear = await fetchYear(selectedYear);

    // Retrieve the array of venues that have concerts that year
    const venues = dataOnSelectedYear.venues;
    // Output venues to locations on map
    outputVenuesToMap(map, venues);

    // Output the venue names to the page
    // First, get reference to the venues div
    const venuesOutputDiv = document.querySelector("#venues");
    // Generate the list of venue elements
    const venueDOM = generateVenuesList(venues);
    // append the venue elements to the venues div
    for (const venue of venueDOM){
        venuesOutputDiv.appendChild(venue);
    }

    if (!venuesOutputDiv.classList.contains('overflow-scroll')){
        venuesOutputDiv.classList.add('overflow-scroll');
    }

    // Get references to clicked year div and to years list
    const yearEl = clickedH3? event.target.parentElement : event.target;
    const yearsList = yearEl.parentElement;

    // change the text of the years filter to the selected year
    const yearsFilter = yearsList.previousElementSibling;
    // console.log(yearsFilter)
    yearsFilter.querySelector("h3").innerText = selectedYear;

    // show the edit button
    yearsFilter.querySelector(".edit").classList.remove('hidden');

    // toggle the year list closed
    yearsFilter.click();
}

export const handleVenueSelection = (event, venueId, venuesArray) => {
    // get the venue out of the venues array
    const venue = venuesArray.filter((venue) => venue.id === venueId)[0];
    console.log(venue)
    console.log(venue.name)
    // get a reference to the venues div
    const venuesDiv = document.querySelector("#venues");
    // empty the venues list
    venuesDiv.innerHTML = '';
    // display the name of the selected venue
    const venueInfo = document.createElement('div');
    venueInfo.classList.add('venue');
    const venueName = document.createElement('h3');
    venueName.innerText = venue.name;
    venueInfo.appendChild(venueName);
    venuesDiv.appendChild(venueInfo);
    venuesDiv.classList.remove('overflow-scroll');
    // output the venue's concerts to the page
    document.querySelector("#concerts").innerHTML = generateOneVenuesConcerts(venue);
}

/*
    This event handler is triggered when the user interacts
    with the genres filter. Clicking on the genres filter
    toggles the visibility of the genres list.

    In addition to toggling the list visibility,
    it toggles the arrow icon from up to down
 */
export const toggleGenreListVisibility = event => {
    const genreList = document.querySelector("#genre-list");
    genreList.classList.toggle('hidden');
}

/*
*  This handler toggles the visibility of
*  the decade list and the year list
* */

export const toggleVisibility = (event, elementReference) => {
    elementReference.classList.toggle('hidden');
}

/*
    This event handler is triggered when the user selects a genre
*/
export const handleGenreSelection = async (event, map) => {
    emptyContent();
    // user might click on the h3, or on the padding for the genre selector div
    // if it's the h3, grab its text content, then grab its genre id
    // otherwise select the h3 and get its text content, then its genre id
    const selectedGenre = event.target.localName === 'h3' ? event.target.textContent.toLowerCase() : event.target.querySelector("h3").textContent.toLowerCase();
    const selectedGenreId = event.target.localName === 'h3' ? parseInt(event.target.parentElement.dataset.id) : parseInt(event.target.dataset.id);
    // get the year currently selected by the user
    const selectedYear = parseInt(document.querySelector("#year-selector").value);
    // retrieve venues for that specific year and genre
    const genreVenuesForSelectedYear = await getVenuesForYearAndGenre(selectedGenreId, selectedYear);
    // output venue locations to map
    outputVenuesToMap(map, genreVenuesForSelectedYear);
    // output concert info to page
    document.querySelector("#concerts").innerHTML = generateConcertHTML(genreVenuesForSelectedYear);
    // replace current genre heading with name of selected genre
    document.querySelector("#genres").querySelector("h2").innerText = selectedGenre;
    // trigger click event on genres div
    // this hides the genre selector if it's showing
    document.querySelector("#genres").click();
}
