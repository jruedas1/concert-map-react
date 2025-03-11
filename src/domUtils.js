import {
    handleMarkerClick, handleMarkerMouseEnter, handleMarkerMouseOut,
    handleVenueMouseEnter, handleVenueMouseOut,
    handleVenueSelection,
    handleYearSelection, handleSingleVenueDivClick
} from "./simpleSearchEventHandlers.js";
import {fetchGenreData} from "./dataAccess.js";
import { handleGenreSelection } from "./exploreSearchEventHandlers.js"

/*
    Removes markers from map
    Note that this uses a custom class reference
    The map uses custom markers and the .marker class
    is added when the markers are created. It is
    NOT a default Mapbox class
    We also remove any highlighted markers,
    which receive a different class
 */
//
export const removeMarkers = () => {
    const markers = document.querySelectorAll(".marker");
    if (markers) markers.forEach(marker => marker.remove());
    const highlightedMarkers = document.querySelectorAll(".y-marker");
    if (highlightedMarkers) highlightedMarkers.forEach(marker => marker.remove());
}

/*
* Removes popups from map.
* Note that this uses a default Mapbox class, .mapboxgl-popup
* */
export const removePopups = () => {
    const popups = document.querySelectorAll(".mapboxgl-popup");
    popups.forEach(popup => popup.remove());
}

export const emptyConcertInfo = () => {
    document.querySelector("#concerts").replaceChildren();
}

export const emptyVenueInfo = () => {
    document.querySelector("#venues").replaceChildren();
}

/*
* The boxes that appear on the map when a marker is clicked
* in mobile view
* */
export const removeSingleVenueDivs = () => {
     document.querySelectorAll('.single-venue').forEach(div=> div.remove());
}

export const hideSingleVenueDivs = () => {
     document.querySelectorAll('.single-venue').forEach(div=> div.classList.add('hidden'));
}

export const showSingleVenueDivs = () => {
     document.querySelectorAll('.single-venue').forEach(div=> div.classList.remove('hidden'));
}

/*
* Utility function to combine removing markers,
* popups, venue data, and concert data from page
* */
export const emptyContent = () => {
    removeMarkers();
    removePopups();
    emptyConcertInfo();
    emptyVenueInfo();
}

/*
* When the explore search is selected,
* the simple search filters have to be hidden
* */
export const hideSimpleSearchFilters = () => {
    const simpleSearchFilters = [
        document.querySelector("#decades"),
        document.querySelector("#decade-list"),
        document.querySelector("#years"),
        document.querySelector("#year-list"),
        document.querySelector("#year-to-venue-breadcrumb"),
        document.querySelector("#concert-to-venue-breadcrumb"),
        document.querySelector("#confirm-year-parent")
    ];
    simpleSearchFilters.forEach(filter => {
       if (!filter.classList.contains('hidden')) filter.classList.add('hidden');
    });
}

/*
* When the simple search is selected,
* the explore search filters have to be hidden
* */
export const hideExploreSearchFilters = () => {
    const exploreSearchFilters = [
        document.querySelector("#year-range"),
        document.querySelector("#range-selection-container"),
        document.querySelector("#genres"),
        document.querySelector("#genre-list"),
        document.querySelector("#range-genre-breadcrumb-container"),
        document.querySelector("#confirm-genre-parent")
    ];
    exploreSearchFilters.forEach(filter =>{
       if (!filter.classList.contains('hidden')) filter.classList.add('hidden');
    });
}

/*
* Function to output venue data to map.
* This function takes an array of venue objects
* 1. Loop over the array of venue objects
* 2. If the venue object contains valid long and lat,
*    create a custom div:
*       a. Create a div for the marker
*       b. Add the .marker class to the div
*          Note that the svg representing the marker is set in
*          the css file under the .marker class rules
*       c. Set the data-id attribute corresponding to the venue
*       d. Create a new mapbox marker using the
*          custom div we just created
*       e. Set the longitude and latitude of the marker
*       f. Add the marker to the map
*       g. Create a popup with the venue's name
*       h. Add the popup to the marker.
* 3. Once the markers have been added, obtain a reference to them
* 4. Loop over the markers and add the event handlers to detect user clicks
* */
export const outputVenuesToMap = (map, venuesArray) => {
    venuesArray.forEach((venue) => {
        outputVenueToMap(map, venue);
    });
    const markers = document.querySelectorAll('.marker');
    markers.forEach(marker => {
        const venueId = marker.dataset.id;
        marker.addEventListener('mouseover', event => handleMarkerMouseEnter(event, venueId));
        marker.addEventListener('mouseout', event => handleMarkerMouseOut(event, venueId));
        marker.addEventListener('click', event => handleMarkerClick(map, event, parseInt(venueId), venuesArray));
    });
}

export const outputVenueToMap = (map, venue) => {
        if (venue.longitude && venue.latitude){
            const el = document.createElement('div');
            el.className = 'marker';
            el.setAttribute('data-id', venue.id);
            const venueMarker = new mapboxgl.Marker(el);
            venueMarker.setLngLat([venue.longitude, venue.latitude]);
            venueMarker.addTo(map);
            // const popup = new mapboxgl.Popup()
            //     .setHTML('<p>'+ venue.name + '</p>');
            // venueMarker.setPopup(popup);
            return venueMarker;
        }
}



/*
* This method runs when the page first loads
* It dynamically generates the genre list based on
* the master genres in the genres data
* Once the genres list is generated, it is output to the DOM,
* but it remains hidden until the user interacts
* with the genres filter
*
* this function needs a reference to the MapBox map object
* this is because an event handler gets attached to each
* genre DOM element, and when the user clicks on these elements,
* the venues get output to the map
*/
export const generateGenreList = async (map) => {
    const genreList = document.querySelector("#genre-list");
    const genreData = await fetchGenreData();
    for (const genre of genreData){
        const genreDiv = document.createElement('div');
        genreDiv.innerHTML = `
             <div class="genre filter-option" data-id="${genre['id']}">
                 <h3>${genre['name'].toUpperCase()}</h3>
             </div>
            `;
        genreDiv.addEventListener('click', event => handleGenreSelection(event, map));
        genreList.appendChild(genreDiv);
    }
}

export const generateYearList = (decade, map) => {
    const yearList = document.querySelector("#year-list");
    yearList.innerHTML = '';
    const newYears = [];
    for (let i = decade; i < decade + 10; i++){
        const yearDiv = document.createElement('div');
        yearDiv.classList.add('year', 'filter-option');
        yearDiv.dataset.id = i.toString();
        yearDiv.innerHTML = `<h3>${i.toString()}</h3>`;
        yearDiv.addEventListener('click', event => handleYearSelection(event, map));
        newYears.push(yearDiv);
    }
    yearList.replaceChildren(...newYears);
}


/*
* Utility function, generates option elements
* in numeric order from 'start' to 'end'
* */
const createYearOptions = (start, end) => {
    const yearOptions = [];
        for (let i = start; i <= end; i++){
            let option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            yearOptions.push(option);
        }
        return yearOptions;
}

/*
* This generates the default browser dropdowns
* This is hidden from the user but serves as the
* source for the visible custom dropdowns. The custom dropdowns
* in turn modifies this, so that JS can read its value.
* */
export const generateYearDropDown = () => {
    const selectionInput = document.querySelector("#default-range-selector");
    const endRangeInput = document.querySelector("#default-end-range-selector");
    selectionInput.replaceChildren(...createYearOptions(1970, 2005));
    endRangeInput.replaceChildren(...createYearOptions(1970, 2009));
}

const createCustomDropdownOptions = (sourceDropdown, customSelector) => {
    const customOptions = [];
    // loops over the hidden default select menu options
    for (let i = 0; i < sourceDropdown.length; i++){
        // Create a div for each option
        const customOption = document.createElement("div");
        // Match the content of the custom option to the corresponding hidden default
        customOption.innerText = sourceDropdown.options[i].innerText;
        // Each option needs a click handler
        customOption.addEventListener("click", e => {
            // Loop over the hidden dropdown options to find the match
            for (let j = 0; j < sourceDropdown.length; j++){
                if (sourceDropdown.options[j].innerText === e.target.innerText){
                    // We change the selected index on the hidden / default dropdown options
                    sourceDropdown.selectedIndex = j;
                    // change the text in the always-visible select dropdown
                    customSelector.innerText = e.target.innerText;
                    // 'same-as-selected' is a class used to add a background color to the
                    // currently selected option in the dropdown
                    const selectedOption = e.target.parentElement.getElementsByClassName('same-as-selected');
                    // In case there is more than one, find all of them and remove the class
                    [...selectedOption].forEach(option => option.classList.remove('same-as-selected'));
                    // Add the class to the current selection
                    e.target.classList.add('same-as-selected');
                    break;
                }
            }
            sourceDropdown.dispatchEvent(new Event('change'));
            // Initiate a click on the dropdown selection to close the dropdown
            customSelector.click();
        });
        // Once the option div has been created, add it to the array
        customOptions.push(customOption);
    }
    return customOptions;
}

/*
* Generates the custom dropdown for selecting a five-year range
* Happens on page load
* */
export const generateCustomDropdownOptions = () => {
    const defaultDropdownSelect = document.querySelector("#default-range-selector");
    const defaultEndRangeSelect = document.querySelector("#default-end-range-selector");
    const customOptionsContainer = document.querySelector("#custom-start-range-options");
    const customEndRangeOptionsContainer = document.querySelector("#custom-end-range-options");
    const customSelectorSelectedDiv = document.querySelector("#custom-start-range-selector");
    const customEndRangeSelectorSelectedDiv = document.querySelector("#custom-end-range-selector");
    // Generate options and append to the correct place in the DOM
    customOptionsContainer.append(...createCustomDropdownOptions(defaultDropdownSelect, customSelectorSelectedDiv));
    customEndRangeOptionsContainer.append(...createCustomDropdownOptions(defaultEndRangeSelect, customEndRangeSelectorSelectedDiv));
}

export const outputOneVenuesConcertsToPage = venue => {
    const concertList = generateOneVenuesConcerts(venue);
    const concertsDiv = document.querySelector("#concerts");
    emptyConcertInfo();
    for (const concert of concertList){
        concertsDiv.appendChild(concert);
    }
}

export const generateOneVenuesConcerts = venue => {
    const concertList = [];
    venue.concerts.forEach(concert => {
        const concertDiv = generateOneConcertHTML(concert);
        concertList.push(concertDiv);
    });
    return concertList;
}

export const generateOneConcertHTML = concert => {
    const concertDiv = document.createElement('div');
    concertDiv.classList.add('concert-info');
    const artistHeading = document.createElement('h3');
    artistHeading.innerText = concert.Artist_Formula;
    const venueOutput = document.createElement('p');
    venueOutput.innerText = concert.Venue;
    const dateOutput = document.createElement('p');
    dateOutput.innerText = `${concert.Month} ${concert.Day} ${concert.Year}`;
    concertDiv.appendChild(artistHeading);
    concertDiv.appendChild(venueOutput);
    concertDiv.appendChild(dateOutput);
    return concertDiv;
}

/*
* The venues list that gets output to the page
* has a click event handler attached to each venue div
* to manage this, instead of generating text html
* we use document.createElement and return a nodeList
* */
export const generateVenuesList = venuesArray => {
    const venuesOutput = [];
    venuesArray.forEach(venue => {
        // create the venue div
        const venueDiv = document.createElement('div');
        // and the 'venue' class and the data-id attribute set to the venue id
        venueDiv.classList.add('venue');
        venueDiv.dataset.id = venue.id;
        // create the h3 element with the name of the venue
        const venueHeading = document.createElement('h3');
        venueHeading.innerText = venue.name;
        // put the heading in the venue div
        venueDiv.appendChild(venueHeading);
        // add the click handler to the venue div
        venueDiv.addEventListener('click', event => handleVenueSelection(event, venue.id, venuesArray));
        venueDiv.addEventListener('mouseover', event => handleVenueMouseEnter(event, venue.id));
        venueDiv.addEventListener('mouseout', event => handleVenueMouseOut(event, venue.id));
        // add the venue div to the list
        venuesOutput.push(venueDiv);
    });
    return venuesOutput;
}

export const generateSingleVenueDiv = (venue, venuesArray) => {
        const venueName = venue.name;
        const venueAddressLine1 = venue.address;
        const venueAddressLine2 =  `${venue.city}, TX ${venue.zip}`;
        // create the div to contain the information
        const venueDiv = document.createElement('div');
        const nameH = document.createElement('h3');
        const addrP = document.createElement('p');
        nameH.innerText = venueName;
        addrP.innerHTML = `${venueAddressLine1}<br>${venueAddressLine2}`;
        venueDiv.appendChild(nameH);
        venueDiv.appendChild(addrP);
        venueDiv.classList.add('single-venue');
        // Handle a click on the div
        venueDiv.addEventListener('click', event => handleSingleVenueDivClick(event, venue, venuesArray));
        return venueDiv;
}

/*
*  This function toggles the visibility of
*  the decade, year, and genre lists
* */
export const toggleVisibility = (event, elementReference) => {
    elementReference.classList.toggle('hidden');
}

/*
* Hide an element if it's not hidden
* */
export const hideElement = (event, elementReference) => {
    if (!elementReference.classList.contains('hidden')){
        elementReference.classList.add('hidden');
    }
}
/*
* Show an element if it's hidden
* */
export const showElement = (event, elementReference) => {
    if (elementReference.classList.contains('hidden')){
        elementReference.classList.remove('hidden');
    }
}

export const showElementMobile = (event, elementReference) => {
    if (elementReference.classList.contains('mobile-hidden')) {
        elementReference.classList.remove('mobile-hidden');
    }
}

export const hideElementMobile = (event, elementReference) => {
    if (!elementReference.classList.contains('mobile-hidden')){
        elementReference.classList.add('mobile-hidden');
    }
}

/*
* handle transitions from desktop to mobile width
* */
export const handleWindowResize = (event, breakpoint) => {
    const currentWidth = window.innerWidth;
    const exploreModeSelectionMade = !document.querySelector("#range-genre-breadcrumb-container").classList.contains('hidden');
    const exploreModeListMapViewButton = document.querySelector("#explore-list-view");
    const venuesEl = document.querySelector("#venues");
    // if the window goes above 768
    if (currentWidth > breakpoint && !window.aboveBreakPoint){
        window.aboveBreakPoint = true;
        hideSingleVenueDivs();
        if (exploreModeSelectionMade){
            showElement(event, document.querySelector("#concerts"));
            hideElement(event, document.querySelector("#single-concert-div"));
        }
    } else if (currentWidth <= breakpoint && window.aboveBreakPoint){
        // if the window goes below 768
        window.aboveBreakPoint = false;
        showSingleVenueDivs();
        if (exploreModeSelectionMade){
            exploreModeListMapViewButton.innerText = "Map View";
        } else {
            document.querySelector("#list-view").innerText = "Map View";
        }
    }
}

/*
* This function searches for the
* */
export const returnMarkerToNormalCondition = (map, event, venuesArray) => {
    const selectedMarkers = document.querySelectorAll('.y-marker');
    selectedMarkers.forEach(marker => {
            marker.classList.remove('y-marker');
            marker.classList.add('marker');
            const id = marker.dataset.id;
            marker.addEventListener('mouseover', event => handleMarkerMouseEnter(event, id));
            marker.addEventListener('mouseout', event => handleMarkerMouseOut(event, id));
            marker.addEventListener('click', event => handleMarkerClick(map, event, id, venuesArray));
        });
}

/*
* Please note this requires a Mapbox map object
* NOT a DOM selection of a node containing a map
* */
export const findMarkerById = (map, id) => {
    return map['_container'].querySelector(`[data-id='${id.toString()}']`);
}

export const highlightMarker = marker => {
    marker.classList.remove('marker');
    marker.classList.add('y-marker');
}

export const deHighlightMarker = marker => {
    marker.classList.remove('y-marker');
    marker.classList.add('marker');
}

export const findHighlightedMarkers = () => {
    return document.querySelectorAll('.y-marker');
}

export const findAndDeHighlightMarkers = () => {
    const highlightedMarkers = findHighlightedMarkers();
    if (highlightedMarkers.length !== 0) highlightedMarkers.forEach(marker => deHighlightMarker(marker));
}

export const findAndHighlightMarker = (map, venueId) => {
    const marker = findMarkerById(map, venueId);
    if (marker) highlightMarker(marker);
}

export const mobileMenu = () => {
    document.querySelector(".hamburger").classList.toggle('active');
    document.querySelector('.nav-menu').classList.toggle('active');
}

// Utility function to determine if an element
// is a descendant of another element
export const isDescendant = (descendant, parent) => {
    return parent.contains(descendant);
}

export const handleModalWindowClick = event => {
    const modalWrapper = document.querySelector("#modalWrapper");
    modalWrapper.classList.remove('showModal');
    modalWrapper.classList.add('hideModal');
    document.querySelector(".header").classList.add("mobile-hidden");
}