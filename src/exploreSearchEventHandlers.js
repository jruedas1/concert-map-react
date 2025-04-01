import {
    emptyConcertInfo, findAndDeHighlightMarkers, findAndHighlightMarker,
    findMarkerById,
    generateOneConcertHTML,
    hideElement, hideElementMobile,
    outputVenueToMap, removeMarkers, removePopups, showElement, showElementMobile,
    toggleVisibility
} from "./domUtils.js";
import {stopAnimation, setStopAnimation} from "./searchTypeEventHandlers.js";
import {fetchGenreConcertsInYearRange, getConcertsForYearAndGenre, getVenue} from "./dataAccess.js";
import {capitalizeWords} from "./utils.js";


/*
* Clicking on the explore tab year dropdown selection
* -- toggles visibility of the dropdown options
* -- toggles the up and down arrow
* -- toggles visibility of the select genre button
* */
export const handleYearRangeYearSelection = event => {
    event.stopPropagation();

    const isStartYearClicked = event.target.id === "custom-start-range-selector";

    const startDropdown = document.querySelector("#custom-start-range-selector").nextElementSibling;
    const endDropdown = document.querySelector("#custom-end-range-selector").nextElementSibling;

    // Close the other dropdown first
    if (isStartYearClicked) {
        endDropdown.classList.add('hidden');
        document.querySelector("#custom-end-range-selector").classList.remove("select-arrow-active");
    } else {
        startDropdown.classList.add('hidden');
        document.querySelector("#custom-start-range-selector").classList.remove("select-arrow-active");
    }

    // Toggle the clicked dropdown
    const currentDropdown = isStartYearClicked ? startDropdown : endDropdown;
    const currentSelector = event.target;

    const isCurrentlyOpen = !currentDropdown.classList.contains('hidden');
    if (isCurrentlyOpen) {
        currentDropdown.classList.add('hidden');
        currentSelector.classList.remove("select-arrow-active");
    } else {
        currentDropdown.classList.remove('hidden');
        currentSelector.classList.add("select-arrow-active");
    }

    const confirmButton = document.querySelector("#confirm-range-selection");
    if (startDropdown.classList.contains('hidden') && endDropdown.classList.contains('hidden')) {
        confirmButton.classList.remove('hidden');
    } else {
        confirmButton.classList.add('hidden');
    }
}


/*
* The year-range filter prompt "Select A Date Range"
* Clicking this filter area will toggle the visibility of the year range selector.
* */
export const handleEdit5YearRange = event => {
    setStopAnimation(true);
    emptyConcertInfo();
    const yearRangeSelector = document.querySelector("#range-selection-container");
    const yearRangeEditor = document.querySelector("#year-range");
    const yearRangeEditorText = yearRangeEditor.querySelector("h3");
    const genreSelector = document.querySelector("#genres");
    const genreList = document.querySelector("#genre-list");
    const showMyResultsButton = document.querySelector("#confirm-genre-parent");
    if (!yearRangeEditorText.innerText.toLowerCase().startsWith("s")){
        showElement(event, yearRangeSelector);
        yearRangeEditorText.innerText = "SELECT A DATE RANGE";
        if ('cursor' in yearRangeEditor.style) yearRangeEditor.style.removeProperty('cursor');
        hideElement(event, yearRangeEditor.querySelector('.edit'));
    }
    yearRangeEditor.classList.toggle('explore-selected-filter', false);
    genreSelector.classList.toggle('explore-selected-filter', false);
    hideElement(event, genreSelector);
    hideElement(event, genreList);
    hideElement(event, showMyResultsButton);
}

/*
* Handles interaction with the year-range selectors
* -- Gets references to selected start and end years
* -- Gets references to the displayed end selection and the corresponding custom dropdown
* -- Gets references to the displayed start selection and the corresponding custom dropdown
* -- Figures out whether the start or end dropdown has been clicked
* -- Based on this, sets variables to refer to the alt-dropdown to the one selected
* -- If the selected start year is greater than the selected end year,
*   the end year is adjusted
* -- if the selected end year is less than the selected start year,
*   the start year is adjusted
* -- A function, adjusted for either option, changes the 'same-as-selected'
*   class assignment on the alt-dropdown, so the altered selection is bolded correctly
* */
export const handleYearRangeSelection = event => {

    const endYearSelector = document.querySelector("#default-end-range-selector");
    const selectedEndYear = endYearSelector.value;

    const startYearSelector = document.querySelector("#default-range-selector");
    const selectedStartYear = startYearSelector.value;

    const displayedEndYearEl = document.querySelector("#custom-end-range-selector");
    const visibleEndYearDropdown = document.querySelector("#custom-end-range-options");

    const displayedStartYearEl = document.querySelector("#custom-start-range-selector");
    const visibleStartYearDropdown = document.querySelector("#custom-start-range-options");

    const endYearSelectorClicked = event.target.id.includes("end");

    const inactiveHiddenDropdown = endYearSelectorClicked ? startYearSelector : endYearSelector;
    const inactiveDisplayedDateEl = endYearSelectorClicked ? displayedStartYearEl : displayedEndYearEl;
    const inactiveVisibleDropdown = endYearSelectorClicked ? visibleStartYearDropdown : visibleEndYearDropdown;


    if (!endYearSelectorClicked && selectedStartYear > selectedEndYear) {
        inactiveHiddenDropdown.value = selectedStartYear.toString();
        inactiveDisplayedDateEl.innerText = selectedStartYear.toString();
        boldMatchingOption('start');
    }
    if (endYearSelectorClicked && selectedEndYear < selectedStartYear) {
        inactiveHiddenDropdown.value = selectedEndYear.toString();
        inactiveDisplayedDateEl.innerText = selectedEndYear.toString();
        boldMatchingOption('end');
    }

    function boldMatchingOption(startOrEnd){
        const year = startOrEnd === 'start' ? selectedStartYear : selectedEndYear;
        let matchingInactiveOption = null;
        // Find the matching option div in the inactive dropdown
        for (let i = 0; i < inactiveVisibleDropdown.children.length; i++){
            if (inactiveVisibleDropdown.children[i].innerText === year.toString()) {
                matchingInactiveOption = inactiveVisibleDropdown.children[i];
                break;
            }
        }
        const currentlySelected = inactiveVisibleDropdown.getElementsByClassName('same-as-selected');
        [...currentlySelected].forEach(option => option.classList.remove('same-as-selected'));
        if (matchingInactiveOption) matchingInactiveOption.classList.add('same-as-selected');
    }

}

/*
* Behavior executed when the "Next" button is clicked after year range selection
* Gets reference to base year selected by user
* Makes "edit" prompt visible on date range selection prompt
* Changes content of "Select a date range" to selected range
* Hides the range slider
* Shows the genres filter
* */
export const handleConfirm5YearRangeSelection = event => {
    const yearRangeStartSelector = document.querySelector("#default-range-selector");
    const selectedBaseYear = yearRangeStartSelector.value;
    const yearRangeEndSelector = document.querySelector("#default-end-range-selector");
    const selectedEndYear = yearRangeEndSelector.value;
    const yearRangeFilter = document.querySelector("#year-range");
    /* Once a year is selected, the text "SELECT A DATE RANGE"
    *  is replaced by feedback about the year-range selected,
    *  the "Edit" prompt is revealed,
    *  and the cursor changes to pointer to indicate it is clickable
    * */
    yearRangeFilter.querySelector('.edit').classList.remove('hidden');
    yearRangeFilter.querySelector('h3').innerText = `${selectedBaseYear} - ${selectedEndYear}`;
    yearRangeFilter.style.cursor = "pointer";
    toggleVisibility(event, document.querySelector("#range-selection-container"));
    toggleVisibility(event, document.querySelector("#genres"));
    showElement(event, document.querySelector("#genre-list"));
    yearRangeFilter.classList.toggle('explore-selected-filter', true);
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
async function outputConcertsOnTimer(concertsArray, percentPerConcert, map) {
    const concertOutputDiv = document.querySelector("#concerts");
    const singleConcertDiv = document.querySelector("#single-concert-div");
    const progressBar = document.querySelector("#progress");
    let currWidth = parseFloat(progressBar.style.width) || 0;
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

    const yearOutputDiv = document.querySelector("#animation-year-output h2");
    let currYear = parseInt(concertsArray[0]["Year"]);
    yearOutputDiv.innerText = currYear.toString();

    // we need references to the markers
    // so we can make them visible after the animation is done
    // this is to hold the references
    const markers = [];

    /* As long as there is no stopAnimation signal,
    *  loop over the concerts array
    * */
    for (let i = 0; i < concertsArray.length && !stopAnimation; i++){

        if (parseInt(concertsArray[i]["Year"]) > currYear){
            currYear = parseInt(concertsArray[i]["Year"]);
            yearOutputDiv.innerText = currYear.toString();
        }
        /*
        * For each concert, obtain its id
        * Retrieve the venue data
        * Determine if the  marker is already on the map
        * If it's not on the map, put it on the map
        * Generate the concert info html
        * Add the concert html to the concert list
        * Wait some milliseconds before going to the next one
        * */
        const concertVenueId = concertsArray[i]['venue_id'];
        /* Here, rather than querying the db for each venue,
        *  we query our unique venues map. This reduces the
        *  db queries */
        const venue = uniqueVenueMap[concertVenueId];
        const venueMarkerOnMap = findMarkerById(map, concertVenueId);
        if (!venueMarkerOnMap) {
            const marker = outputVenueToMap(map, venue);
            // in explore mode we don't want to see popups
            // during the animation
            if (marker){
                marker._popup._classList.add('hidden');
                // add reference to marker to our markers array
                markers.push(marker);
            }
        }
        findAndDeHighlightMarkers();
        findAndHighlightMarker(map, venue.id);
        const concertDiv = generateOneConcertHTML(concertsArray[i]);
        concertOutputDiv.prepend(concertDiv);
        // Move the progress bar
        currWidth += percentPerConcert;
        if (currWidth > 100) currWidth = 100;
        progressBar.style.width = currWidth + "%";
        // On mobile, we generate the single concert output
        // We need it to exist on the page even in desktop,
        // In case the user narrows the browser window, but it's
        // usually hidden in desktop.
        // We are putting the same node in two places in the DOM
        // that's not actually possible so we have to clone it first
        const concertDivClone = concertDiv.cloneNode(true);
        singleConcertDiv.replaceChildren(concertDivClone);
        // here's where the delay length is set
        await delay(500);
    }
    // loop through the map markers and make them visible again
    markers.forEach(marker => marker._popup._classList.delete('hidden'));
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
    const genresFilter = document.querySelector("#genres");
    genresFilter.click();
    if (!genresFilter.classList.contains('explore-selected-filter')) genresFilter.classList.add('explore-selected-filter');
    showElement(event, document.querySelector("#confirm-genre-parent"));
    showElement(event, document.querySelector("#genres .edit"));
}

/*
* Event handler triggered in explore mode when user clicks "Show My Results"
* */
export const handleConfirmGenreSelection = async (event, map) => {
    // Ensure that the stop animation global is set to false
    // So the animation can run
    setStopAnimation(false);
    // Hide the "SHOW MY RESULTS" button
    hideElement(event, event.target.parentElement);
    // Hide the year range and genres filters
    hideElement(event, document.querySelector("#year-range"));
    hideElement(event, document.querySelector("#genres"));
    hideElement(event, document.querySelector("#genre-list"));
    hideElement(event, document.querySelector("#range-selection-container"));
    // Obtain the selected year and genre
    const selectedYear = parseInt(document.querySelector("#default-range-selector").value);
    const selectedEndYear = parseInt(document.querySelector("#default-end-range-selector").value);
    const selectedGenreHeading = document.querySelector("#genres").querySelector("h3");
    const selectedGenre = selectedGenreHeading.innerText
    const selectedGenreId = parseInt(selectedGenreHeading.dataset.id);
    // Output selected year range and genre to the breadcrumb
    const changeSelectionDiv = document.querySelector("#range-genre-breadcrumb-container");
    const yearRangeBreadcrumb = document.querySelector("#year-range-breadcrumb");
    yearRangeBreadcrumb.innerHTML = `${selectedYear}&ndash;${selectedEndYear}`;
    const genreBreadcrumb = document.querySelector("#genre-breadcrumb");
    genreBreadcrumb.innerText = selectedGenre;
    // Reveal the change selection div
    showElement(event, changeSelectionDiv);

    // If we are on mobile, we must additionally show the map
    // And also hide the search/explore selection and show the header
    if (window.innerWidth <= 768) {
        // on mobile the single-concert output div is fixed positioned,
        // the map overlaps at and venues are hidden. Moving the map center south
        // pushes up the map center, which helps keep the venue markers on screen
        map.setCenter([-98.48725, 29.37879]);
        hideElement(event, document.querySelector("#concerts"));
        showElementMobile(event, document.querySelector("#map"));
        const concertOutputDiv = document.querySelector("#single-concert-div");
        showElement(event, concertOutputDiv);
        /*
        * Strange bug, Mapbox map does not change shape on mobile
        * until resized.
        * https://github.com/mapbox/mapbox.js/issues/488
        * You have to manually trigger a resize.
        * This needs to happen after the map visibility changes
        * Otherwise you have to do it on a timeout 0 or 1
        * */
        map.resize();
        hideElement(event, document.querySelector("#search-type-selector"));
        // showElementMobile(event, document.querySelector("header"));
    }

    /* Get all the concerts in the selected year range
        Calculate how many there are
        Calculate what percentage each concert represents
        This is for the progress bar
   */
    const concertsForYearRange = await fetchGenreConcertsInYearRange(selectedGenreId, selectedYear, selectedEndYear);
    const numConcerts = concertsForYearRange.length;
    const percentPerConcert = 100/numConcerts;
    // Output concert data to the page
    // This includes markers on map, concert info in list, and year on map, plus progress bar
    await outputConcertsOnTimer(concertsForYearRange, percentPerConcert , map);
}

/*
* Triggered when user clicks "Change Selections" in explore mode
* */
export const handleChangeYearAndGenreSelections = (event, map) => {
    // Stop current animation
    setStopAnimation(true);
    // Hide the "Change selections option and current selection output
    hideElement(event, document.querySelector("#range-genre-breadcrumb-container"));
    // Show the "SELECT A DATE RANGE" PROMPT and hide edit prompt
    const yearRangeSelector = document.querySelector("#year-range");
    const genreSelector = document.querySelector("#genres");
    showElement(event, yearRangeSelector);
    yearRangeSelector.querySelector("h3").innerText = "SELECT A DATE RANGE";
    hideElement(event, yearRangeSelector.querySelector('p.edit'));
    // show the year selection menu
    showElement(event, document.querySelector("#range-selection-container"));
    // Hide the genre selection process
    hideElement(event, genreSelector);
    hideElement(event, document.querySelector("#genre-list"));
    hideElement(event, document.querySelector("#confirm-genre-parent"));
    // In mobile, hide the map
    // and the single-concert output
    hideElementMobile(event, document.querySelector("#map"));
    hideElement(event, document.querySelector("#single-concert-div"));
    // Empty the map
    removePopups();
    removeMarkers();
    /* In mobile, remove the animation year output
    *  Hide the mobile header
    *  Show the search type selector
    *  */
    document.querySelector("#animation-year-output h2").innerText = '';
    // hideElementMobile(event, document.querySelector("header"));
    showElement(event, document.querySelector("#search-type-selector"));
    // Wipe out the previously output concert list
    emptyConcertInfo();
    // On mobile, remove any single-concert data
    document.querySelector("#single-concert-div").innerHTML = '';
    // On mobile, the map is shifted when viewing the data visualization. This moves it back
    map.setCenter([-98.48725, 29.44879]);
    // Remove color from year-range and genre filter selection areas
    yearRangeSelector.classList.toggle('explore-selected-filter', false);
    // reset the progress bar to zero
    const progressBar = document.querySelector("#progress");
    progressBar.style.width = "0%";
}

export const handleExploreListViewClick = (event, map) => {
    /*
    * We need stopPropagation in order to prevent the "change selections"
    * from triggering
    * */
    event.stopPropagation();
    const destination = event.target.innerText.toLowerCase();
    if (destination.includes('list')) {
        hideElementMobile(event, document.querySelector("#map"));
        hideElementMobile(event, document.querySelector("#single-concert-div"));
        hideElement(event, document.querySelector("#single-concert-div"));
        showElement(event, document.querySelector("#concerts"));
        event.target.innerText = 'Map View';
    } else {
        showElementMobile(event, document.querySelector("#map"));
        showElementMobile(event, document.querySelector("#single-concert-div"));
        showElement(event, document.querySelector("#single-concert-div"));
        hideElement(event, document.querySelector("#concerts"));
        event.target.innerText = 'List View';
        map.resize();
    }

}

//