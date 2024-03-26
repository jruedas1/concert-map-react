import { fetchYear } from "./dataAccess.js";
import { removeMarkers, outputVenuesToMap } from "./domUtils.js";
import { handleYearSelection, handleDecadeSelection } from "./eventHandlers.js";

const yearSelector = document.querySelector("#year-selector");
yearSelector.addEventListener('change', handleYearSelection);

const decadeSelector = document.querySelector("#decade-selector");
decadeSelector.addEventListener('input', handleDecadeSelection);

(async () => {
    removeMarkers();
    document.querySelector("#decade-selector").value = 1970;
    let selectedYear = document.querySelector("#year-selector").value;
    const dataOnSelectedYear = await fetchYear(selectedYear);
    const venues = dataOnSelectedYear.venues;
    outputVenuesToMap(venues);
})();