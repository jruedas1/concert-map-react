import '../css/SearchResultsButton.css';
import { useContext } from "react";
import ConcertsContext from "../context/ConcertsContext.js";

function SearchResultsButton(){
    const { confirmYearSelection } = useContext(ConcertsContext);

    return (
        <div id="confirm-year-parent" className="confirm">
            <button
                id="confirm-year"
                className="next"
                onClick={confirmYearSelection}
            >
                SHOW MY RESULTS
            </button>
        </div>
    );
}

export default SearchResultsButton;