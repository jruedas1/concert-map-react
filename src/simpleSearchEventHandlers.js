import {
    emptyContent,
    emptyConcertInfo,
    generateVenuesList,
    generateYearList,
    outputVenuesToMap,
    showElement,
    hideElement,
    showElementMobile,
    hideElementMobile,
    outputOneVenuesConcertsToPage,
    generateSingleVenueDiv,
    returnMarkerToNormalCondition, outputVenueToMap,
    findMarkerById, removeSingleVenueDivs
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
export const handleMarkerClick =  (map, event, venueId, venuesArray) => {
    venueId = parseInt(venueId);

    // This behavior applies only in mobile view
    if (window.innerWidth <= 768){
        // Loop over the filters to find the id match
        const venue = venuesArray.filter((venue) => venue.id === venueId)[0];
        // extract the name and address
        const venueDiv = generateSingleVenueDiv(venue, venuesArray);
        // Remove any existing single-venue output divs
        removeSingleVenueDivs();
        // Insert the div into the DOM
        document.querySelector("main").appendChild(venueDiv);
        /*
        * In order to ensure that the clicked marker turns color
        * and remains that color, we need to remove its
        * mouseenter and mouseout event listeners.
        * To accomplish this we remove it,
        * add a new one in its place, and
        * give the new one the y-marker class.
        * We also need to find if there are any other
        * markers currently marked as selected.
        * To these we must add the corresponding
        * mouseout and mouseenter listeners again
        * as well as setting the normal marker class
        * */
        // this searches the map for y-markers
        // then changes their marker class
        // and adds the event listeners
        returnMarkerToNormalCondition(map, event, venuesArray);
        // remove the clicked marker
        event.target.remove();
        // replace it with a new marker that has no listeners
        outputVenueToMap(map, venue);
        // get a reference to the new marker
        const newMarker = findMarkerById(map, venueId);
        // change the marker to appear selected
        newMarker.classList.remove('marker');
        newMarker.classList.add('y-marker');

        // because we had a mouseenter for the click, and
        // then no mouse-out, the corresponding venue in the list
        // retains the venue-hover class, which was imposed
        // on mouseenter and never removed. Remove it
        const matchingVenue = document.querySelector("#venues").querySelector(`[data-id='${venueId.toString()}']`);
        matchingVenue.classList.remove('venue-hover');
    }
    // Only in desktop view, if the marker is clicked show the concerts for that venue
    if (window.innerWidth > 768){
        handleVenueSelection(event, venueId, venuesArray);
    }

}

export const handleSingleVenueDivClick = (event, venue, venuesArray) => {
    handleVenueSelection(event, venue.id, venuesArray);
    removeSingleVenueDivs();
    hideElementMobile(event, document.querySelector("#map"));
    /*
    * We would like to be able to return to the same view
    * Therefore we need to know that
    * (1) We came from the single venue view, not the list view
    * (2) What venue is selected when we navigate back
    * */
    document.querySelector("#back-to-venues").dataset.origin = "map";
    document.querySelector("#concert-to-venue-breadcrumb-flex-parent").querySelector("p").dataset.id = venue.id;
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
    decadeFilter.classList.add('selected-filter');

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

    // Get references to clicked year div and to years list
    // Get the venues info from the db
    // output markers on map
    const clickedH3 = event.target.localName === 'h3';
    const yearEl = clickedH3? event.target.parentElement : event.target;
    const yearsList = yearEl.parentElement;

    // change the text of the years filter to the selected year
    const selectedYear = clickedH3 ? event.target.innerText : event.target.dataset.id;
    const yearsFilter = yearsList.previousElementSibling;
    yearsFilter.querySelector("h3").innerText = selectedYear;
    // show the edit button
    yearsFilter.querySelector(".edit").classList.remove('hidden');
    yearsFilter.classList.add('selected-filter');
    // hide the year list
    hideElement(event, document.querySelector("#year-list"));
    // show the confirm button
    showElement(event, document.querySelector("#confirm-year-parent"));
}

export const handleConfirmYearSelection = async (event, map) => {
    const selectedYear = document.querySelector("#years").querySelector("h3").innerText;
    const dataOnSelectedYear = await fetchYear(selectedYear);
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

    /*
    * We need to hide the decade and year selectors
    * as well as the next button itself
    * And we need to show the breadcrumb indicator
    * */
    // hide the decade and year filters
    hideElement(event, document.querySelector("#decades"));
    hideElement(event, document.querySelector("#years"))
    hideElement(event, event.target.parentElement);
    // show the breadcrumb indicator
    showElement(event, document.querySelector("#year-to-venue-breadcrumb"));

    if (window.innerWidth < 768){
        mobileUIChangesAfterConfirmYear(event);
    }

    /* This is to solve a bug in Mapbox where the map does not display at
    *  correct dimensions when first loaded in mobile view, until it is resized
    *  To solve it, force a resize event
    * Note that this requires a reference to the map element
    * If this is not available, use window.dispatchEvent(new Event('resize'));
    * Note that this needs to happen **after** the map visibility is changed
    * */
    map.resize();

    // add the selected year to the breadcrumb indicator
    document.querySelector("#year-breadcrumb").innerText = selectedYear;
}

const mobileUIChangesAfterConfirmYear = event => {
    hideElementMobile(event, document.querySelector("#venues"));
    showElementMobile(event, document.querySelector("#map"));
    showElementMobile(event, document.querySelector("header"));
    hideElementMobile(event, document.querySelector("#search-type-selector"));
}

const mobileUIChangesReturningToYearSelection = event => {
    showElement(event, document.querySelector("#decades"));
    showElement(event, document.querySelector("#years"))
    hideElement(event, document.querySelector("#year-to-venue-breadcrumb"));
    hideElementMobile(event, document.querySelector("header"));
    showElementMobile(event, document.querySelector("#search-type-selector"));
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
    outputOneVenuesConcertsToPage(venue);

    if (window.innerWidth <= 768){
        document.querySelector("#back-to-venues").dataset.origin = "list";
        document.querySelector("#concert-to-venue-breadcrumb-flex-parent").querySelector("p").dataset.id = venue.id;
    }

    // highlight the selected marker
    // changes to DOM visibility will trigger a mouse out event,
    // to avoid this problem, set the highlight on a 1ms timer
    // it will highlight the marker after the DOM changes
    setTimeout(() => {
        matchingMarker.classList.remove('marker');
        matchingMarker.classList.add('y-marker');
    }, 1);
}

export const handleYearToVenueBreadcrumbClick = async (event) => {
    emptyContent();
    mobileUIChangesReturningToYearSelection(event);
    if (window.innerWidth < 768) {
        hideElementMobile(event, document.querySelector("#map"));
        /* a venue has been turned yellow (selected) and had its
        * mouseout and mouseenter events removed, we have to
        * add the event handlers again and turn it back to blue
        * */
        removeSingleVenueDivs();
        const selectedYear = document.querySelector("#year-breadcrumb").innerText;
        const yearData = await fetchYear(selectedYear);
        const venues = yearData.venues;
        returnMarkerToNormalCondition(map, event, venues);

        // Reset the text of the "List View" / "Map View" button to make
        // sure that it always says "List View" when the user first comes
        // to the venue selection view
        document.querySelector("#list-view").innerText = "List View";
    }
}

export const handleConcertsToVenuesBreadcrumbClick = async (event) => {
    emptyConcertInfo();
    showElement(event, document.querySelector("#year-to-venue-breadcrumb"));
    hideElement(event, document.querySelector("#concert-to-venue-breadcrumb"));

     const venueAndYearInfo = document.querySelector("#concert-to-venue-breadcrumb-flex-parent");
     const selectedYear = venueAndYearInfo.querySelector("h2").innerText;
     const yearData = await fetchYear(selectedYear);
     const venues = yearData.venues;

    if (window.innerWidth > 768) {
        showElement(event, document.querySelector("#venues"));
        returnMarkerToNormalCondition(map, event, venues);
    }

    if (window.innerWidth <= 768){
            // Regardless of where the user came from, we want the single venue output
            // on the map
            // get the venue id
            const selectedVenueId = parseInt(venueAndYearInfo.querySelector("p").dataset.id);
            // from here we need to reproduce the venue div
            // which means get the venue object from the data
            const venue = venues.filter((venue) => venue.id === selectedVenueId)[0];
            // then run outputSingleVenue
            const venueDiv = generateSingleVenueDiv(venue, venues);
            // make sure there are no other concert divs in the DOM
            removeSingleVenueDivs();
            // Insert the div into the DOM
            document.querySelector("main").appendChild(venueDiv);
        // if the user navigated to the concerts view from the map view
        if (document.querySelector("#back-to-venues").dataset.origin==="map"){
            // show the map
            showElementMobile(event, document.querySelector("#map"));
            document.querySelector("#list-view").innerText = "List View";
        } else {
            // otherwise show the venues list
            showElement(event, document.querySelector("#venues"));
            showElementMobile(event, document.querySelector("#venues"));
            document.querySelector("#list-view").innerText = "Map View";

            const highlightedMarker = document.querySelector(".y-marker");
            if (highlightedMarker){
                highlightedMarker.classList.remove('y-marker');
                highlightedMarker.classList.add('marker');
            }
            // hide any single venue divs, we don't want to see these in
            // list view
            const singleVenueDiv = document.querySelector(".single-venue");
            if (singleVenueDiv) hideElement(event, document.querySelector(".single-venue"));
        }
    }
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

// handler for marker mouse enter
export const handleMarkerMouseEnter = (event, venueId) => {
    const matchingVenue = document.querySelector("#venues").querySelector(`[data-id='${venueId.toString()}']`);
    matchingVenue.classList.add('venue-hover');
    event.target.classList.remove('marker');
    event.target.classList.add('y-marker');
}

// handler for marker mouse out
export const handleMarkerMouseOut = (event, venueId) => {
     const matchingVenue = document.querySelector("#venues").querySelector(`[data-id='${venueId.toString()}']`);
     matchingVenue.classList.remove("venue-hover");
     event.target.classList.remove('y-marker');
     event.target.classList.add('marker');
}

export const handleListMapViewClick = event => {
    const destination = event.target.innerText.toLowerCase();
    const singleVenueDiv = document.querySelector(".single-venue");
    if (destination.includes('list')) {
        if (singleVenueDiv) hideElement(event, document.querySelector(".single-venue"));
        showElementMobile(event, document.querySelector("#venues"));
        showElement(event, document.querySelector("#venues"));
        hideElementMobile(event, document.querySelector("#map"));
        event.target.innerText = 'Map View';
    } else {
        hideElementMobile(event, document.querySelector("#venues"));
        showElementMobile(event, document.querySelector("#map"));
        if (singleVenueDiv) showElement(event, document.querySelector(".single-venue"));
        event.target.innerText = 'List View';
    }
    window.dispatchEvent(new Event('resize'));
}

