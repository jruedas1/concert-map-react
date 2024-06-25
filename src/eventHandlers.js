import {
    emptyContent,
    generateConcertHTML,
    generateOneVenuesConcerts,
    generateVenuesList,
    generateYearList, hideSimpleSearchFilters,
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
    // The overflow-scroll property on the venues div
    // is only applied when the full venue list is displayed
    // and the concerts list is not
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

/*
*   On search type selection, modify the "selected" marker
*   and trigger the appropriate search type selection
* */
export const handleSearchTypeSelection = event => {
    if (event.target.innerText.toLowerCase() === 'search'){
        if (!event.target.classList.contains('selected')){
            event.target.classList.add('selected');
            event.target.nextElementSibling.classList.remove('selected');
            handleSimpleSearchSelection(event);
        }
    } else {
        /* If it's not the search being selected, it's explore
        * */
        if (!event.target.classList.contains('selected')){
             event.target.classList.add('selected');
             event.target.previousElementSibling.classList.remove('selected');
             handleExploreSelection(event);
        }
    }
}

export const handleSimpleSearchSelection = event => {
    toggleVisibility(event, document.querySelector("#decades"));
    toggleVisibility(event, document.querySelector("#year-range"));
    toggleVisibility(event, document.querySelector("#year-slider-container"));
}

export const handleExploreSelection = event => {
    emptyContent();
    hideSimpleSearchFilters();
    toggleVisibility(event, document.querySelector("#year-range"));
    toggleVisibility(event, document.querySelector("#year-slider-container"));
}

/*
    This event handler is triggered when the user interacts
    with the genres filter. Clicking on the genres filter
    toggles the visibility of the genres list.
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

export const handleEdit5YearRange = event => {
    if (!document.querySelector("#year-range").firstElementChild.innerText.toLowerCase().startsWith('s')) {
         const yearRangeSlider = document.querySelector("#year-slider-container");
         toggleVisibility(event, yearRangeSlider);
    }
}

export const handleYearRangeSelection = event => {
    const resultDisplayDiv = document.querySelector("#range-selection-state");
    const baseYear = event.target.value;
    resultDisplayDiv.innerHTML = `<p>${baseYear} - ${parseInt(baseYear) + 4}`;
}

export const handleConfirm5YearRangeSelection = event => {
    const yearRangeSlider = document.querySelector("#year-slider");
    const selectedBaseYear = yearRangeSlider.value;
    const yearRangeFilter = document.querySelector("#year-range");
    yearRangeFilter.querySelector('.edit').classList.remove('hidden');
    yearRangeFilter.querySelector('h3').innerText = `${selectedBaseYear} - ${parseInt(selectedBaseYear) + 4}`;
    toggleVisibility(event, document.querySelector("#year-slider-container"));
    toggleVisibility(event, document.querySelector("#genres"));
}

const timer = ms => new Promise(res=>setTimeout(res, ms));

async function outputVenuesOnTimer(venuesArray) {
    for (let i = 0; i < venuesArray.length; i++){
        console.log(venuesArray[i].name);
        await timer(1000);
    }
}


/*
    This event handler is triggered when the user selects a genre
*/
export const handleGenreSelection = async (event, map) => {
    const selectedGenre = event.target.localName === 'h3' ? event.target.textContent.toLowerCase() : event.target.querySelector("h3").textContent.toLowerCase();
    const selectedGenreId = event.target.localName === 'h3' ? parseInt(event.target.parentElement.dataset.id) : parseInt(event.target.dataset.id);
    // get the year currently selected by the user
    const selectedYear = parseInt(document.querySelector("#year-slider").value);
    console.log(selectedYear);
    // retrieve venues for that specific year and genre

    for (let i = selectedYear; i < selectedYear+5; i++){
         const genreVenuesForSelectedYear = await getVenuesForYearAndGenre(selectedGenreId, i);
         await outputVenuesOnTimer(genreVenuesForSelectedYear);

    }

    // output venue locations to map
    // outputVenuesToMap(map, genreVenuesForSelectedYear);
    // output concert info to page
    // document.querySelector("#concerts").innerHTML = generateConcertHTML(genreVenuesForSelectedYear);
    // replace current genre heading with name of selected genre
    document.querySelector("#genres").querySelector("h2").innerText = selectedGenre;
    // trigger click event on genres div
    // this hides the genre selector if it's showing
    document.querySelector("#genres").click();
}
