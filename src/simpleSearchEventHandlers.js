import {
    emptyContent,
    generateOneVenuesConcerts,
    generateVenuesList,
    generateYearList,
    outputVenuesToMap, showElement,
    hideElement
} from "./domUtils.js";
import {fetchYear} from "./dataAccess.js";

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
export const handleYearSelection = async (event) => {

    /*  whenever a year is selected, remove
        any markers and popups displayed on the map
        and remove any concert info currently displayed
     */
    emptyContent();
    // Retrieve the data on the selected year
    const clickedH3 = event.target.localName === 'h3';

    const selectedYear = clickedH3 ? event.target.innerText : event.target.dataset.id;

    // Get references to clicked year div and to years list
    const yearEl = clickedH3? event.target.parentElement : event.target;
    const yearsList = yearEl.parentElement;

    // change the text of the years filter to the selected year
    const yearsFilter = yearsList.previousElementSibling;
    // console.log(yearsFilter)
    yearsFilter.querySelector("h3").innerText = selectedYear;

    // show the edit button
    yearsFilter.querySelector(".edit").classList.remove('hidden');

    // show the confirmation (NEXT) button
    showElement(event, document.querySelector("#confirm-year-and-decade-parent-div"));

    // toggle the year list closed
    yearsFilter.click();
}

export const handleConfirmYearSelection = async (event, map) => {

    // Retrieve the data on the selected year
    const selectedYear = document.querySelector("#years").querySelector("h3").innerText;
    console.log(selectedYear)
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
    // The overflow-scroll property on the venues div
    // is only applied when the full venue list is displayed
    // and the concerts list is not
    if (!venuesOutputDiv.classList.contains('overflow-scroll')){
        venuesOutputDiv.classList.add('overflow-scroll');
    }

    // hide the Next button
    // actually hides its parent element
    hideElement(event, event.target.parentElement.parentElement);
}

export const handleVenueSelection = (event, venueId, venuesArray) => {
    // get the venue out of the venues array
    const venue = venuesArray.filter((venue) => venue.id === venueId)[0];
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
    // This removes the overflow-scroll property from the venues div
    // For reasons not entirely clear, that property interferes
    // with visibility of a single venue div when the concerts div
    // is also displayed
    venuesDiv.classList.remove('overflow-scroll');
    // output the venue's concerts to the page
    document.querySelector("#concerts").innerHTML = generateOneVenuesConcerts(venue);
}

