import {findMarkerById, generateOneConcertHTML, outputVenueToMap, toggleVisibility} from "./domUtils.js";
import {stopAnimation} from "./searchTypeEventHandlers.js";
import {getConcertsForYearAndGenreLocal, getVenue} from "./dataAccess.js";


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
* Behavior executed when the "Next" button is clicked after year range selection
* Gets reference to base year selected by user
* Makes "edit" prompt visible on 5-year range selection prompt
* Changes content of "Select 5-year range" to selected range
* Hides the range slider
* Shows the genres filter
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
        const venue = await getVenue(concertVenueId);
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
    document.querySelector("#genres").querySelector("h2").innerText = selectedGenre;
    // trigger click event on genres div
    // this hides the genre list if it's showing
    document.querySelector("#genres").click();
    // Get the genre id
    const selectedGenreId = event.target.localName === 'h3' ? parseInt(event.target.parentElement.dataset.id) : parseInt(event.target.dataset.id);
    // get the base year currently selected by the user
    const selectedYear = parseInt(document.querySelector("#year-slider").value);
    // retrieve venues for the selected year range
    // do animation for each year
    for (let i = selectedYear; i < selectedYear+5; i++){
         const genreConcertsForSelectedYear = await getConcertsForYearAndGenreLocal(selectedGenreId, i);
         await outputConcertsOnTimer(genreConcertsForSelectedYear['concerts'], map);
    }
}
