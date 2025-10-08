import '../css/SearchResultsButton.css';
import { useContext } from "react";
import ViewportContext from "../context/ViewportContext";
import ConcertsContext from "../context/ConcertsContext.js";

function SearchResultsButton(){
    const { confirmYearSelection } = useContext(ConcertsContext);
    const { isMobile, setSingleVenueMode } = useContext(ViewportContext);

    const handleConfirmYear = () => {
        confirmYearSelection();
        if (isMobile) setSingleVenueMode(true);
    }

    return (
        <div id="confirm-year-parent" className="confirm">
            <button
                id="confirm-year"
                className="next"
                onClick={handleConfirmYear}
            >
                SHOW MY RESULTS
            </button>
        </div>
    );
}

export default SearchResultsButton;