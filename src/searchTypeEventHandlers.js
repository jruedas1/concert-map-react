import {
    emptyContent, hideExploreSearchFilters,
    hideSimpleSearchFilters, hideElement,
    showElement, toggleVisibility, hideElementMobile, handleModalWindowClick
} from "./domUtils.js";

/*
* This is a global variable that controls the genre-concert animation
* If it is set to true, the animation loop does not execute
* Selecting simple search will set this to true,
* which will stop the animation effects.
* Selecting explore search will set it back to false,
* which will permit the animation to run.
* */
export let stopAnimation = false;

export const setStopAnimation = val => stopAnimation = val;

/*
*   On search type selection, modify the "selected" marker
*   and trigger the appropriate search type selection
* */
export const handleSearchTypeSelection = event => {
    const searchModeSelector = document.querySelector("#search-type-selector h3.search-mode-selector");
    const exploreModeSelector = document.querySelector("#search-type-selector h3.explore-mode-selector");
    if (event.target.classList.contains('search-mode-selector')){
        if (!searchModeSelector.classList.contains('selected')){
            searchModeSelector.classList.add('selected');
            exploreModeSelector.classList.remove('selected');
            handleSimpleSearchSelection(event);
        }
    } else {
        /* If it's not the search being selected, it's explore
            This happens either through the EXPLORE h3
            or the splash page START EXPLORING button
        * */
        if (!exploreModeSelector.classList.contains('selected')){
             exploreModeSelector.classList.add('selected');
            searchModeSelector.classList.remove('selected');
             handleExploreSelection(event);
        }
    }
}

/*
* Behavior specific to the simple search selection.
* Stop any animation that is happening on the map
* Clear map markers and venue / concert info
* We hide the explore filters
* And show the decade selection filter
* */
export const handleSimpleSearchSelection = event => {
    const decadesFilter = document.querySelector("#decades");
    const decadesEditPrompt = decadesFilter.querySelector('p');
    const yearsFilter = document.querySelector("#years");
    const yearsEditPrompt = yearsFilter.querySelector("p");
    const concertList = document.querySelector("#concerts");
    stopAnimation = true;
    emptyContent();
    hideExploreSearchFilters();
    document.querySelector("#animation-year-output h2").innerText = '';
    decadesFilter.querySelector("h3").innerText = "SELECT A DECADE";
    hideElement(event, decadesEditPrompt);
    showElement(event, decadesFilter);
    if (decadesFilter.classList.contains('selected-filter')) decadesFilter.classList.remove('selected-filter');
    showElement(event, document.querySelector("#decade-list"));
    showElement(event, concertList);
    yearsFilter.querySelector('h3').innerText = 'SELECT A YEAR';
     if (yearsFilter.classList.contains('selected-filter')) yearsFilter.classList.remove('selected-filter');
    hideElement(event, yearsEditPrompt);
    hideElementMobile(event, document.querySelector("#map"));
     // reset the progress bar to zero
    const progressBar = document.querySelector("#progress");
    progressBar.style.width = "0%";
}

/*
* Behavior specific to the explore search selection
* * Clear map markers and venue / concert info
* Hide the simple search filters
* Return simple search selected filters to base state
* Show the year range filter and the range slider
* */
export const handleExploreSelection = event => {
    emptyContent();
    hideSimpleSearchFilters();
    toggleVisibility(event, document.querySelector("#year-range"));
    toggleVisibility(event, document.querySelector("#range-selection-container"));
}

export const handleModalExploreSelection = event => {
    handleModalWindowClick(event);
    console.log(event.target);
}
