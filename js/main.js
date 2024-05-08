import { fetchYear} from "./dataAccess.js";
import { removeMarkers, outputVenuesToMap } from "./domUtils.js";
import {handleYearSelection, handleDecadeSelection, handleGenreSelection, generateGenreList, toggleGenreListVisibility} from "./eventHandlers.js";

// get references to the year and decade filters
// add event handlers to the year and decade selectors
const decadeSelector = document.querySelector("#decade-selector");
decadeSelector.addEventListener('input', handleDecadeSelection);
const yearSelector = document.querySelector("#year-selector");
yearSelector.addEventListener('change', handleYearSelection);
// get reference to genre filter
// add event handler to genre selector
const genreFilter = document.querySelector("#genres");
genreFilter.addEventListener('click', toggleGenreListVisibility);

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
    removeMarkers();
    document.querySelector("#decade-selector").value = 1970;
    let selectedYear = document.querySelector("#year-selector").value;
    const dataOnSelectedYear = await fetchYear(selectedYear);
    const venues = dataOnSelectedYear.venues;
    outputVenuesToMap(venues);
    await generateGenreList();
})();