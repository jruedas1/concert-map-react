import {
    emptyConcertInfo,
    findMarkerById,
    generateOneConcertHTML,
    hideElement,
    outputVenueToMap, showElement,
    toggleVisibility
} from "./domUtils.js";
import {stopAnimation, setStopAnimation} from "./searchTypeEventHandlers.js";
import {getConcertsForYearAndGenre, getVenue} from "./dataAccess.js";
import {capitalizeWords} from "./utils.js";


/*
* Clicking on the explore tab year dropdown selection
* -- toggles visibility of the dropdown options
* -- toggles the up and down arrow
* -- toggles a change to the topmost border-style
* -- toggles visibility of the select genre button
* */
export const handleYearRangeStartYearSelection = event => {
    event.stopPropagation();
    event.target.nextElementSibling.classList.toggle('hidden');
    event.target.classList.toggle("select-arrow-active");
    event.target.classList.toggle("double-border");
    document.querySelector("#confirm-range-selection").classList.toggle('hidden');
}


/*
* The year-range filter prompt "Select A 5-Year Range"
* Clicking this filter area will toggle the visibility of the year range selector.
* */
export const handleEdit5YearRange = event => {
    setStopAnimation(true);
    emptyConcertInfo();
    const yearRangeSelector = document.querySelector("#range-selection-container");
    const genreSelector = document.querySelector("#genres");
    const genreList = document.querySelector("#genre-list");
    toggleVisibility(event, yearRangeSelector);
    hideElement(event, genreSelector);
    hideElement(event, genreList);
}

/*
* Handles interaction with the year range selector
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
* Behavior executed when the "Next" button is clicked after year range selection
* Gets reference to base year selected by user
* Makes "edit" prompt visible on 5-year range selection prompt
* Changes content of "Select 5-year range" to selected range
* Hides the range slider
* Shows the genres filter
* */
export const handleConfirm5YearRangeSelection = event => {
    const yearRangeStartSelector = document.querySelector("#default-range-selector");
    const selectedBaseYear = yearRangeStartSelector.value;
    const yearRangeFilter = document.querySelector("#year-range");
    yearRangeFilter.querySelector('.edit').classList.remove('hidden');
    yearRangeFilter.querySelector('h3').innerText = `${selectedBaseYear} - ${parseInt(selectedBaseYear) + 4}`;
    toggleVisibility(event, document.querySelector("#range-selection-container"));
    toggleVisibility(event, document.querySelector("#genres"));
    // If a genre is already selected, it means the user is coming from "Change Selections"
    // or is returning from the simple search after already having done a visualization
    // In this case show the "show my results" button
    const alreadyChoseGenre = document.querySelector("#genres h3").innerText !== "SELECT A GENRE";
    if (alreadyChoseGenre) showElement(event, document.querySelector("#confirm-genre-parent"));
}

// This is a delay function.
// It accepts a number of milliseconds
// It will pause program execution that number of milliseconds
const delay = ms => new Promise(res=>setTimeout(res, ms));

/*
* Output concert info to sidebar and venue info to map on timer.
* This function takes a venues array and a map reference.
* It outputs each venue it encounters to the map,
* and each concert to the sidebar.
* It uses the delay function to pause execution before each output.
* To afford the ability to stop the program execution,
* each loop checks a global variable, `stopAnimation`.
* This global is set to false on page load, to true when
* switching to simple search, and to false when switching to
* explore search.
* */
async function outputConcertsOnTimer(concertsArray, map) {
    const concertOutputDiv = document.querySelector("#concerts");
    /* For improved efficiency and fewer queries,
    *  we will first loop over the concerts to determine each unique venue id
    *  Then we query the db for each unique venue
    *  Finally, we create a map of venue ids to venue objects
    *  */
    const uniqueVenueIds = [... new Set(concertsArray.map(concert => concert['venue_id']))];
    const uniqueVenues = await Promise.all(uniqueVenueIds.map(venueId => getVenue(venueId)));
    const uniqueVenueMap = uniqueVenues.reduce((acc, venue) => {
       acc[venue.id] = venue;
       return acc;
    }, {});
    /* As long as there is no stopAnimation signal,
    *  loop over the concerts array
    * */
    for (let i = 0; i < concertsArray.length && !stopAnimation; i++){
        /*
        * For each concert, obtain its id
        * Retrieve the venue data
        * Determine if the  marker is already on the map
        * If it's not on the map, put it on the map
        * Generate the concert info html
        * Add the concert html to the concert list
        * Wait 0.3 seconds
        * */
        const concertVenueId = concertsArray[i]['venue_id'];
        /* Here, rather than querying the db for each venue,
        *  we query our unique venues map. This reduces the
        *  db queries */
        const venue = uniqueVenueMap[concertVenueId];
        const venueMarkerOnMap = findMarkerById(map, concertVenueId);
        if (!venueMarkerOnMap) outputVenueToMap(map, venue);
        const concertDiv = generateOneConcertHTML(concertsArray[i]);
        concertOutputDiv.prepend(concertDiv);
        await delay(300);
    }
}

/*
    This event handler is triggered when the user selects a genre
*/
export const handleGenreSelection = async (event, map) => {
    // Get the selected genre
    const selectedGenre = event.target.localName === 'h3' ? event.target.textContent.toLowerCase() : event.target.querySelector("h3").textContent.toLowerCase();
    // replace current genre heading with name of selected genre
    const selectedGenreOutputHeading = document.querySelector("#genres").querySelector("h3");
    selectedGenreOutputHeading.innerText = capitalizeWords(selectedGenre);
    selectedGenreOutputHeading.dataset.id = event.target.localName === 'h3' ? event.target.parentElement.dataset.id : event.target.dataset.id;
    // trigger click event on genres div
    // this hides the genre list if it's showing
    document.querySelector("#genres").click();
    showElement(event, document.querySelector("#confirm-genre-parent"));
    showElement(event, document.querySelector("#genres .edit"));
}

export const handleConfirmGenreSelection = async (event, map) => {
    // Ensure that the stop animation global is set to false
    // So the animation can run
    setStopAnimation(false);
    // Hide the "SHOW MY RESULTS" button
    hideElement(event, event.target.parentElement);
    // Hide the year range and genres filters
    hideElement(event, document.querySelector("#year-range"));
    hideElement(event, document.querySelector("#genres"));
    // Obtain the selected year and genre
    const selectedYear = parseInt(document.querySelector("#default-range-selector").value);
    const selectedGenreHeading = document.querySelector("#genres").querySelector("h3");
    const selectedGenre = selectedGenreHeading.innerText
    const selectedGenreId = parseInt(selectedGenreHeading.dataset.id);
    // Output selected year range and genre to the breadcrumb
    const changeSelectionDiv = document.querySelector("#range-genre-breadcrumb-container");
    const yearRangeBreadcrumb = document.querySelector("#year-range-breadcrumb");
    yearRangeBreadcrumb.innerHTML = `${selectedYear}&ndash;${selectedYear + 4}`;
    const genreBreadcrumb = document.querySelector("#genre-breadcrumb");
    genreBreadcrumb.innerText = selectedGenre;
    // Reveal the change selection div
    showElement(event, changeSelectionDiv);

    // retrieve venues for the selected year range
    // do animation for each year
    for (let i = selectedYear; i < selectedYear+5; i++){
         const genreConcertsForSelectedYear = await getConcertsForYearAndGenre(selectedGenreId, i);
         await outputConcertsOnTimer(genreConcertsForSelectedYear['concerts'], map);
    }
}

export const handleChangeYearAndGenreSelections = event => {
    setStopAnimation(true);
    hideElement(event, document.querySelector("#range-genre-breadcrumb-container"));
    showElement(event, document.querySelector("#year-range"));
    emptyConcertInfo();
}
