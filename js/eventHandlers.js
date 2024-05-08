import {emptyContent, outputVenuesToMap} from "./domUtils.js";
import {fetchGenre, fetchGenreData, fetchYear} from "./dataAccess.js";

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
export const handleDecadeSelection = async event => {
    /*
    * When the user selects a new decade, we are going to
    * modify the year selector to show a new decade
    * 1. get a reference to the year selector
    * 2. Get a reference to the location where the selected decade
    *    is displayed to the user
    * 3. Obtain the decade selected by the user
    * 4. Display the new decade selection to the user
    * 5. Create an empty array to contain selected decade's
    *     dropdown options
    * 6. Generate option elements for the decade and add to array
    * 7. Replace the old dropdown options with the new ones
    * 8. Get the new selected year (should be the first year of
    *    the selected decade)
    * 9. Fetch the concert data for that year
    * 10. Get the array of venues for that year
    * 11. Remove markers and popups from map and concert data from page
    * 12. Output data for selected year to map
    * */
    const yearSelector = document.querySelector("#year-selector");
    const selectedDecadeOutput = document.querySelector("#selected-decade");
    const selectedDecade = parseInt(event.target.value);
    selectedDecadeOutput.textContent = `${selectedDecade}s`;
    const newOptions = [];
    for (let i = selectedDecade; i < selectedDecade + 10; i++){
        const option = document.createElement('option');
        option.text = i.toString();
        option.value = i.toString();
        newOptions.push(option);
    }
    yearSelector.replaceChildren(...newOptions);
    let selectedYear = document.querySelector("#year-selector").value;
    const dataOnSelectedYear = await fetchYear(selectedYear);
    const venues = dataOnSelectedYear.venues;
    emptyContent();
    outputVenuesToMap(venues);
}

// Handler for user interaction with year selector
export const handleYearSelection = async event => {
    /*  whenever a year is selected, remove
        any markers and popups displayed on the map
        and remove any concert info currently displayed
     */
    emptyContent();
    // Retrieve the data on the selected year
    const dataOnSelectedYear = await fetchYear(event.target.value);
    // Retrieve the array of venues that have concerts that year
    const venues = dataOnSelectedYear.venues;
    // Output venues to locations on map
    outputVenuesToMap(venues);
}

export const handleGenreSelection = async event => {
    emptyContent();
    // user might click on the h3, or on the padding for the genre selector div
    // if it's the h3, grab its text content
    // otherwise select the h3 and get its text content
    const selectedGenreId = event.target.localName === 'h3' ? parseInt(event.target.parentElement.id) : parseInt(event.target.id);
    const selectedYear = parseInt(document.querySelector("#year-selector").value);
    const genreResults = await fetchGenre(selectedGenreId);
    let genreVenuesForSelectedYear;
    for (const year of genreResults['years']){
        if (year['id'] === selectedYear){
            genreVenuesForSelectedYear = year["venues"];
        }
    }
    outputVenuesToMap(genreVenuesForSelectedYear);
    let concertsOutput = '';
    genreVenuesForSelectedYear.forEach(venue => {

        // generate the html for the concerts list
        venue.concerts.forEach(concert => concertsOutput+= `
            <div class="concert-info">
                <h3>${concert.Artist_Formula}</h3>
                <p>${concert.Venue}</p>
                <p>${concert.Month} ${concert.Day} ${concert.Year}</p>
            </div>
        `);
    });
    document.querySelector("#concerts").innerHTML = concertsOutput;
    document.querySelector("#genres").querySelector("h2").innerText = selectedGenre;
    document.querySelector("#genres").click();
}

export const toggleGenreListVisibility = event => {
    const icon = document.querySelector("#genres").querySelector("img:first-of-type");
    const upIconSrc = "./img/arrow-up.svg";
    const downIconSrc = "./img/arrow-down.svg";
    icon.src = icon.src.includes('down') ? upIconSrc : downIconSrc;

    const genreList = document.querySelector("#genre-list");
    genreList.classList.toggle('hidden');
    genreList.classList.toggle('visible');
}

export const generateGenreList = async event => {
    const genreList = document.querySelector("#genre-list");
    const genreData = await fetchGenreData();
    for (const genre of genreData){
        const genreDiv = document.createElement('div');
        genreDiv.innerHTML = `
             <div class="genre filter-option" id="${genre['id']}">
                 <h3>${genre['name'].toUpperCase()}</h3>
             </div>
            `;
        genreDiv.addEventListener('click', handleGenreSelection);
        genreList.appendChild(genreDiv);
    }
}
