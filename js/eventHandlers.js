import { emptyContent, outputVenuesToMap } from "./domUtils.js";
import {fetchYear} from "./dataAccess.js";

// technique for setting up callback with extra parameters:
// https://stackoverflow.com/questions/10000083/javascript-event-handler-with-parameters
export const handleMarkerClick =  (event, venuesArray) => {
    const venueId = parseInt(event.target.dataset.id);
    const venue = venuesArray.filter((venue) => venue.id === venueId)[0];
    const concerts = venue.concerts;
    let concertsOutput = '';
    concerts.forEach(concert => concertsOutput+= `
            <div>
                <h3>${concert.Artist_Formula}</h3>
                <p>${concert.Venue} ${concert.Month} ${concert.Day} ${concert.Year}</p>
            </div>
        `);
    document.querySelector("#concerts").innerHTML = concertsOutput;
}

export const handleYearSelection = async event => {
    emptyContent();
    const dataOnSelectedYear = await fetchYear(event.target.value);
    const venues = dataOnSelectedYear.venues;
    outputVenuesToMap(venues);
}

export const handleDecadeSelection = async event => {
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