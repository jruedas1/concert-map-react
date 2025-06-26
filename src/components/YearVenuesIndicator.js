import { useContext } from "react";
import ConcertsContext from "../context/ConcertsContext.js";

function YearVenuesIndicator(){
    const { selectedYear } = useContext(ConcertsContext);

    return (
        <div id="year-venue-breadcrumb-flex-parent">
            <h2 id="year-breadcrumb">{selectedYear}</h2>
            <p>Venues</p>
        </div>
    );
}

export default YearVenuesIndicator;