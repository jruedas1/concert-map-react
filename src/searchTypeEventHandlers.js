import {
    emptyContent, hideExploreSearchFilters,
    hideSimpleSearchFilters, hideElement,
    showElement, toggleVisibility, hideElementMobile
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
    showElement(event, document.querySelector("#decade-list"));
    showElement(event, concertList);
    yearsFilter.querySelector('h3').innerText = 'SELECT A YEAR';
    hideElement(event, yearsEditPrompt);
    hideElementMobile(event, document.querySelector("#map"));
}

/*
* Behavior specific to the explore search selection
* * Clear map markers and venue / concert info
* Hide the simple search filters
* Show the year range filter and the range slider
* */
export const handleExploreSelection = event => {
    emptyContent();
    hideSimpleSearchFilters();
    toggleVisibility(event, document.querySelector("#year-range"));
    toggleVisibility(event, document.querySelector("#range-selection-container"));
}
