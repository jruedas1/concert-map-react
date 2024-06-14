import { MAPBOX_API_KEY } from "./keys.js";
import {generateMap} from "./mabpoxUtils.js";
import { fetchYear} from "./dataAccess.js";
import {removeMarkers, outputVenuesToMap, generateGenreList, generateYearList} from "./domUtils.js";
import {
    handleDecadeSelection, handleSearchTypeSelection,
    toggleGenreListVisibility,
    toggleVisibility
} from "./eventHandlers.js";

const mapConfiguration = {
        accessToken: MAPBOX_API_KEY,
        containerId: 'map',
        style: 'outdoors-v12',
        center: [-98.48725, 29.44879],
        zoom: 11
    }

export const map = await generateMap(mapConfiguration);

// get references to the search and explore selectors
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

const yearFilter = document.querySelector("#years");
const yearList = document.querySelector("#year-list");
yearFilter.addEventListener('click', event => toggleVisibility(event, yearList));

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
    // removeMarkers();
    // document.querySelector("#decade-selector").value = 1970;
    // generateYearList(1970, map);
    // const dataOnSelectedYear = await fetchYear('1970');
    // const venues = dataOnSelectedYear.venues;
    // outputVenuesToMap(map, venues);
    await generateGenreList(map);
})();

