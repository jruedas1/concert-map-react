import { MAPBOX_API_KEY } from "./keys.js";
import {generateMap} from "./mabpoxUtils.js";
import {
    generateCustomDropdownOptions,
    generateGenreList,
    generateYearDropDown, handleModalWindowClick,
    handleWindowResize,
    mobileMenu,
    toggleVisibility
} from "./domUtils.js";
import {
    handleDecadeSelection, handleConfirmYearSelection,
    handleYearToVenueBreadcrumbClick, handleConcertsToVenuesBreadcrumbClick, handleListMapViewClick
} from "./simpleSearchEventHandlers.js";
import { handleSearchTypeSelection} from "./searchTypeEventHandlers.js";
import {
    handleYearRangeSelection,
    handleConfirm5YearRangeSelection,
    handleEdit5YearRange,
    handleYearRangeYearSelection,
    handleConfirmGenreSelection, handleChangeYearAndGenreSelections, handleExploreListViewClick
} from "./exploreSearchEventHandlers.js"

const mapConfiguration = {
        accessToken: MAPBOX_API_KEY,
        containerId: 'map',
        style: 'outdoors-v12',
        center: [-98.48725, 29.44879],
        zoom: 10
    }

/* Here we generate the map and define a reference to the map.
*  The reference to the map is used in the outputVenuesToMap function.
*  The outputVenuesToMap function is triggered by other event handlers.
*  Any event handler that triggers interaction with the map
* requires a reference to the map.
* */
export const map = await generateMap(mapConfiguration);

window.aboveBreakPoint = window.innerWidth > 768;
window.addEventListener('resize', event => handleWindowResize(event, 768));

document.querySelector("main").addEventListener('click', handleModalWindowClick);

/* get references to the top-level "search" and "explore" selectors
*  and add handlers for selecting them
*  */
const searchTypeSelectors = document.querySelectorAll("#search-type-selector h3");
searchTypeSelectors.forEach(selector => selector.addEventListener('click', handleSearchTypeSelection));
searchTypeSelectors.forEach(selector => selector.addEventListener('keypress', e => e.key==='Enter' && handleSearchTypeSelection(e)));

const modalExploreSelector = document.querySelector("#modalOptionDescriptions button.explore-mode-selector");
modalExploreSelector.addEventListener('click', handleSearchTypeSelection);

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

const confirmYearButton = document.querySelector("#confirm-year");
confirmYearButton.addEventListener('click', event => handleConfirmYearSelection(event, map))

const yearToVenueBreadcrumb = document.querySelector("#back-to-year-edit-div > div");
yearToVenueBreadcrumb.addEventListener('click', event => handleYearToVenueBreadcrumbClick(event, map));

const concertsToVenuesBreadcrumb = document.querySelector("#back-to-venues");
concertsToVenuesBreadcrumb.addEventListener('click', event => handleConcertsToVenuesBreadcrumbClick(event, map));

const yearRangeAndGenreChangeSelections = document.querySelector("#change-range-genre-div");
yearRangeAndGenreChangeSelections.addEventListener('click', event => handleChangeYearAndGenreSelections(event, map));
yearRangeAndGenreChangeSelections.addEventListener('keydown', event => {
   if (event.key === 'Enter') handleChangeYearAndGenreSelections(event, map);
});

const listViewButton = document.querySelector("#list-view");
listViewButton.addEventListener('click', handleListMapViewClick);

const exploreListViewButton = document.querySelector("#explore-list-view");
exploreListViewButton.addEventListener('click', event => handleExploreListViewClick(event, map));

/*
* This is the "Select a 5-year range"
* filter. This handler is active only after the user
* has selected and confirmed a 5-year range.
* At that point the "Edit" prompt appears,
* and clicking the filter shows and hides the year-range selector.
* */
const yearRangeFilter = document.querySelector("#year-range");
yearRangeFilter.addEventListener('click', handleEdit5YearRange);
yearRangeFilter.addEventListener('keydown', e => {
   if (e.key === "Enter") handleEdit5YearRange(e);
});

/*
* This handles user interaction with the actual range slider itself
* */
const defaultYearRangeSelector = document.querySelector("#default-range-selector");
const defaultEndYearSelector = document.querySelector("#default-end-range-selector");
defaultYearRangeSelector.addEventListener('change', handleYearRangeSelection);
defaultEndYearSelector.addEventListener('change', handleYearRangeSelection);

const customYearRangeSelector = document.querySelector("#custom-start-range-selector");
const customEndYearRangeSelector = document.querySelector("#custom-end-range-selector");
customYearRangeSelector.addEventListener('click', handleYearRangeYearSelection);
customYearRangeSelector.addEventListener('keypress', e => e.key==='Enter' && handleYearRangeYearSelection(e));
customEndYearRangeSelector.addEventListener('click', handleYearRangeYearSelection);
customEndYearRangeSelector.addEventListener('keypress', e => e.key==='Enter' && handleYearRangeYearSelection(e));

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

const confirmGenreSelectionButton = document.querySelector("#confirm-genre-selection");
confirmGenreSelectionButton.addEventListener('click', event => handleConfirmGenreSelection(event, map));

 generateYearDropDown();
 generateCustomDropdownOptions();
 document.querySelectorAll('.custom-selector').forEach(selector => selector.addEventListener('keydown', e => {
     if (e.keyCode === 40) {
         e.preventDefault();
         e.target.nextElementSibling.firstElementChild.firstChild.focus();
     }
 }));

/* async IIFE
   This is necessary in order to load the remote data on page load
   since the data is stored remotely and obtained via async API call
   */
(async () => {
    await generateGenreList(map);
})();

