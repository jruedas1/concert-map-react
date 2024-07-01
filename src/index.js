import { MAPBOX_API_KEY } from "./keys.js";
import {generateMap} from "./mabpoxUtils.js";
import {generateGenreList, toggleVisibility} from "./domUtils.js";
import {
    handleDecadeSelection,
    handleConfirmYearSelection
} from "./simpleSearchEventHandlers.js";
import { handleSearchTypeSelection } from "./searchTypeEventHandlers.js";
import {  handleYearRangeSelection,
    handleConfirm5YearRangeSelection, handleEdit5YearRange
} from "./exploreSearchEventHandlers.js"

const mapConfiguration = {
        accessToken: MAPBOX_API_KEY,
        containerId: 'map',
        style: 'outdoors-v12',
        center: [-98.48725, 29.44879],
        zoom: 11
    }

/* Here we generate the map and define a reference to the map.
*  The reference to the map is used in the outputVenuesToMap function.
*  The outputVenuesToMap function is triggered by other event handlers.
*  Any event handler that triggers interaction with the map
* requires a reference to the map.
* */
export const map = await generateMap(mapConfiguration);

/* get references to the top-level "search" and "explore" selectors
*  and add handlers for selecting them
*  */
const searchTypeSelectors = document.querySelectorAll("#search-type-selector h3");
searchTypeSelectors.forEach(selector => selector.addEventListener('click', handleSearchTypeSelection));


// get references to the year and decade filters
// add event handlers to the year and decade selectors
const decadeFilter = document.querySelector("#decades");
const decadeList = document.querySelector("#decade-list");
decadeFilter.addEventListener('click', event => toggleVisibility(event, decadeList));
for (const decade of decadeList.children){
    decade.addEventListener('click', event => handleDecadeSelection(event, map));
}

// toggle visibility of year list when the year filter is clicked
const yearFilter = document.querySelector("#years");
const yearList = document.querySelector("#year-list");
yearFilter.addEventListener('click', event => toggleVisibility(event, yearList));

// "Next" button in simple search
const confirmYearSelection = document.querySelector("#confirm-year-and-decade");
confirmYearSelection.addEventListener('click', event => handleConfirmYearSelection(event, map));

/*
* This is the "Select a 5-year range"
* filter. This handler is active only after the user
* has selected and confirmed a 5-year range.
* At that point the "Edit" prompt appears,
* and clicking the filter shows and hides the year-range selector.
* */
const yearRangeFilter = document.querySelector("#year-range");
yearRangeFilter.addEventListener('click', handleEdit5YearRange);

/*
* This handles user interaction with the actual range slider itself
* */
const yearRangeSelector = document.querySelector("#year-slider");
yearRangeSelector.addEventListener('change', handleYearRangeSelection);

/* This is the "Next" button that a user clicks after selecting a year range
*  in the "Explore" tab
*  */
const confirmRangeSelectionButton = document.querySelector("#confirm-range-selection");
confirmRangeSelectionButton.addEventListener('click', handleConfirm5YearRangeSelection);


// get reference to genre filter
// add event handler to genre selector
const genreFilter = document.querySelector("#genres");
const genreList = document.querySelector("#genre-list");
genreFilter.addEventListener('click', event => toggleVisibility(event, genreList));



/* main line of code is an async IIFE
   This is necessary in order to load the default data on page load
   since the data is stored remotely and obtained via async API call
   */
(async () => {
    /* On page load,
        1. Remove any existing map markers
        2. Reset the decade selector to the 1970s
        3. Reset the year selector to 1970
        4. Fetch the data for the selected year -- which should be 1970
        5. Output venues for selected year to the map
    */
    // removeMarkers();
    // document.querySelector("#decade-selector").value = 1970;
    // generateYearList(1970, map);
    // const dataOnSelectedYear = await fetchYear('1970');
    // const venues = dataOnSelectedYear.venues;
    // outputVenuesToMap(map, venues);
    await generateGenreList(map);
})();

