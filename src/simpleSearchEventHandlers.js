import {
    emptyContent, emptyConcertInfo,
    generateOneVenuesConcerts,
    generateVenuesList,
    generateYearList,
    outputVenuesToMap, showElement,
    hideElement
} from "./domUtils.js";
import {fetchYear} from "./dataAccess.js";

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
export const handleDecadeSelection = async (event, map) => {
    /*
    * Get the decade selected by the user and generate the
    * list of years corresponding to that decade
    * */
    const selectedDecade = parseInt(event.target.dataset.id);
    generateYearList(selectedDecade, map);

    /*
    * Change the text from "select a decade"
    * to the selected decade
    * */
    const decadeFilter = event.currentTarget.parentElement.previousElementSibling;
    decadeFilter.querySelector("h3").innerText = selectedDecade.toString() + 's';

    /*
    * Show the edit button
    * Show the years filter
    * */
    decadeFilter.querySelector(".edit").classList.remove('hidden');
    decadeFilter.nextElementSibling.nextElementSibling.classList.remove('hidden');

    /* Close the decade list by triggering the toggleVisibility event*/
    decadeFilter.click();
}


// Handler for user interaction with year selection
export const handleYearSelection = async (event, map) => {

    /*  whenever a year is selected, remove
        any markers and popups displayed on the map
        and remove any concert info currently displayed
     */
    emptyContent();
    // Retrieve the data on the selected year
    const clickedH3 = event.target.localName === 'h3';

    const selectedYear = clickedH3 ? event.target.innerText : event.target.dataset.id;
    const dataOnSelectedYear = await fetchYear(selectedYear);

    // Get references to clicked year div and to years list
    // Get the venues info from the db
    // output markers on map
    const yearEl = clickedH3? event.target.parentElement : event.target;
    const yearsList = yearEl.parentElement;
    const venues = dataOnSelectedYear.venues;
    outputVenuesToMap(map, venues);


    // Output the venue names to the page
    // First, get reference to the venues div
    const venuesOutputDiv = document.querySelector("#venues");
    // Generate the list of venue elements
    const venueDOM = generateVenuesList(venues);
    // append the venue elements to the venues div
    for (const venue of venueDOM){
        venuesOutputDiv.appendChild(venue);
    }

    // The overflow-scroll property on the venues div
    // is only applied when the full venue list is displayed
    // and the concerts list is not
    if (!venuesOutputDiv.classList.contains('overflow-scroll')){
        venuesOutputDiv.classList.add('overflow-scroll');
    }

    // change the text of the years filter to the selected year
    const yearsFilter = yearsList.previousElementSibling;
    // console.log(yearsFilter)
    yearsFilter.querySelector("h3").innerText = selectedYear;

    // show the edit button
    yearsFilter.querySelector(".edit").classList.remove('hidden');

    /*
    * We need to hide the decade and year selectors
    * as well as the next button itself
    * And we need to show the breadcrumb indicator
    * */
    // hide the decade and year filters
    hideElement(event, document.querySelector("#decades"));
    hideElement(event, document.querySelector("#years"))
    // hide the Next button by hiding its parent element
    hideElement(event, event.target.parentElement.parentElement);
    // show the breadcrumb indicator
    showElement(event, document.querySelector("#year-to-venue-breadcrumb"));

    // add the selected year to the breadcrumb indicator
    document.querySelector("#year-breadcrumb").innerText = selectedYear;

}

export const handleVenueSelection = (event, venueId, venuesArray) => {
    // we need the currently selected year
    const yearToVenueBreadcrumbDiv = document.querySelector("#year-to-venue-breadcrumb");
    const selectedYear = yearToVenueBreadcrumbDiv.querySelector('div h2').innerText;
    // hide the venues-to-years breadcrumb
    hideElement(event, yearToVenueBreadcrumbDiv);
    // show the concerts-to-venues breadcrumb
    const concertToVenueBreadcrumbDiv = document.querySelector("#concert-to-venue-breadcrumb");
    concertToVenueBreadcrumbDiv.querySelector("#concert-to-venue-breadcrumb-flex-parent").querySelector('h2').innerText = selectedYear;
     // get the venue out of the venues array
    const venue = venuesArray.filter((venue) => venue.id === venueId)[0];
    // display the name of the venue
    concertToVenueBreadcrumbDiv.querySelector("#concert-to-venue-breadcrumb-flex-parent").querySelector('p').innerText = venue.name;
    showElement(event, concertToVenueBreadcrumbDiv);

    // get a reference to the venues div
    const venuesDiv = document.querySelector("#venues");
    // hide the venues list
    hideElement(event, venuesDiv);

    // get reference to venue marker on map
    const matchingMarker = map.querySelector(`[data-id='${venueId.toString()}']`);

    // output the venue's concerts to the page
    // document.querySelector("#concerts").innerHTML = generateOneVenuesConcerts(venue);
    const concertList = generateOneVenuesConcerts(venue);
    const concertsDiv = document.querySelector("#concerts");
    for (const concert of concertList){
        concertsDiv.appendChild(concert);
    }

    // changes to DOM visibility will trigger a mouse out event,
    // which will automatically de-highlight a venue
    // to avoid this problem, set the highlight on a 1ms timer
    // it will highlight the marker after the DOM changes
    setTimeout(() => {
        matchingMarker.classList.remove('marker');
        matchingMarker.classList.add('y-marker');
    }, 1)
}

export const handleYearToVenueBreadcrumbClick = event => {
    emptyContent();
    showElement(event, document.querySelector("#decades"));
    showElement(event, document.querySelector("#years"))
    hideElement(event, document.querySelector("#year-to-venue-breadcrumb"));
}

export const handleConcertsToVenuesBreadcrumbClick = async(event) => {
    const highlightedMarker = document.querySelector(".y-marker");
    if (highlightedMarker){
        highlightedMarker.classList.remove('y-marker');
        highlightedMarker.classList.add('marker');
    }
    emptyConcertInfo();
    showElement(event, document.querySelector("#venues"));
    showElement(event, document.querySelector("#year-to-venue-breadcrumb"));
    hideElement(event, document.querySelector("#concert-to-venue-breadcrumb"));
}

export const handleVenueMouseEnter = (event, venueId) => {
    const matchingMarker = map.querySelector(`[data-id='${venueId.toString()}']`);
    matchingMarker.classList.remove('marker');
    matchingMarker.classList.add('y-marker');
}

export const handleVenueMouseOut = (event, venueId) => {
   const matchingMarker = map.querySelector(`[data-id='${venueId.toString()}']`);
   matchingMarker.classList.remove('y-marker');
   matchingMarker.classList.add('marker');
}


