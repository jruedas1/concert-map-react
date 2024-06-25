import {
    emptyContent,
    generateOneConcertHTML,
    generateOneVenuesConcerts,
    generateVenuesList,
    generateYearList, hideExploreSearchFilters, hideSimpleSearchFilters,
    outputVenuesToMap, outputVenueToMap,
} from "./domUtils.js";
import {fetchYear, getVenuesForYearAndGenre} from "./dataAccess.js";

/*
* This is a global variable that controls the genre-concert animation
* If it is set to true, the animation loop does not execute
* Selecting simple search will set this to true,
* which will stop the animation effects.
* Selecting explore search will set it back to false,
* which will permit the animation to run.
* */
let stopAnimation = false;

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

/*
* Behavior specific to the simple search selection.
* We have to stop any animation that is happening on the map
* We clear the map markers and any venue or concert info
* We hide the explore filters
* And show the decade selection filter
* */
export const handleSimpleSearchSelection = event => {
    stopAnimation = true;
    emptyContent();
    hideExploreSearchFilters()
    toggleVisibility(event, document.querySelector("#decades"));
}

/*
* Behavior specific to the explore search selection
* We allow animations to run again
* We hide the simple search filters
* We show the year range filter and the range slider
* */
export const handleExploreSelection = event => {
    stopAnimation = false;
    emptyContent();
    hideSimpleSearchFilters();
    toggleVisibility(event, document.querySelector("#year-range"));
    toggleVisibility(event, document.querySelector("#year-slider-container"));
}

/*
*  This handler toggles the visibility of
*  the decade, year, and genre lists
* */
export const toggleVisibility = (event, elementReference) => {
    elementReference.classList.toggle('hidden');
}

/*
* The year-range filter prompt "Select A 5-Year Range"
* This handler is active only after a user has selected a 5-year range
* and thus revealed the "Edit" prompt.
* Once this is done, clicking this filter area will toggle the visibility of the year range slider.
* */
export const handleEdit5YearRange = event => {
    if (!document.querySelector("#year-range").firstElementChild.innerText.toLowerCase().startsWith('s')) {
         const yearRangeSlider = document.querySelector("#year-slider-container");
         toggleVisibility(event, yearRangeSlider);
    }
}

/*
* Handles interaction with the year range slider
* --Gets a reference to the location where the selected year range is output to the user
* --Obtains a reference to the value selected by the user
* --Outputs selected year range to user in appropriate place
* */
export const handleYearRangeSelection = event => {
    const resultDisplayDiv = document.querySelector("#range-selection-state");
    const baseYear = event.target.value;
    resultDisplayDiv.innerHTML = `<p>${baseYear} - ${parseInt(baseYear) + 4}`;
}

/*
*
* */
export const handleConfirm5YearRangeSelection = event => {
    const yearRangeSlider = document.querySelector("#year-slider");
    const selectedBaseYear = yearRangeSlider.value;
    const yearRangeFilter = document.querySelector("#year-range");
    yearRangeFilter.querySelector('.edit').classList.remove('hidden');
    yearRangeFilter.querySelector('h3').innerText = `${selectedBaseYear} - ${parseInt(selectedBaseYear) + 4}`;
    toggleVisibility(event, document.querySelector("#year-slider-container"));
    toggleVisibility(event, document.querySelector("#genres"));
}

// This is a delay function.
// It accepts a number of milliseconds
// It will pause program execution that number of milliseconds
const delay = ms => new Promise(res=>setTimeout(res, ms));

/*
* Output concert info to sidebar and venue info to map on timer
* This function takes a venues array and a map reference
* It outputs each venue it encounters to the map
* And each concert to the sidebar
* It uses the delay function to pause execution before each output
* */
async function outputConcertsOnTimer(venuesArray, map) {
    const concertOutputDiv = document.querySelector("#concerts");
    for (let i = 0; i < venuesArray.length && !stopAnimation; i++){

        outputVenueToMap(map, venuesArray[i]);
        for (let i = 0; i < venuesArray[i].concerts.length && !stopAnimation; i++){
            const concert = venuesArray[i].concerts[i];
            const concertDiv = generateOneConcertHTML(concert);
            concertOutputDiv.prepend(concertDiv);
            await delay(1000);
        }

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
         await outputConcertsOnTimer(genreVenuesForSelectedYear, map);

    }
    // replace current genre heading with name of selected genre
    document.querySelector("#genres").querySelector("h2").innerText = selectedGenre;
    // trigger click event on genres div
    // this hides the genre selector if it's showing
    if (!stopAnimation) document.querySelector("#genres").click();
}
