import { useState, useContext } from "react";
import ConcertsContext from "../context/ConcertsContext.js";
import DecadeSelectionIndicator from './DecadeSelectionIndicator.js';
import DecadeList from "./DecadeList.js";
import YearList from "./YearList.js";
import YearSelectionIndicator from "./YearSelectionIndicator.js";
import SearchResultsButton from "./SearchResultsButton.js";

function YearSelectPanel(){
    const { selectedYear, updateSelectedYear,
        selectedDecade, updateSelectedDecade,
        showDecadeList, updateShowDecadeList} = useContext(ConcertsContext);
    const [showYearList, setShowYearList] = useState(false);

    const handleSelectDecade = (selectedDecade) => {
        updateSelectedDecade(selectedDecade);
        updateShowDecadeList(false);
        setShowYearList(true);
    }

    const handleClickDecadeSelectionIndicator = () => {
        updateShowDecadeList(!showDecadeList);
    }

    const handleSelectYear = (selectedYear) => {
        updateSelectedYear(selectedYear);
        setShowYearList(false);
    }

    const handleClickYearSelectionIndicator = () => {
        setShowYearList(!showYearList);
    }

    return(
        <>
            <DecadeSelectionIndicator
                decade={selectedDecade}
                onClick={handleClickDecadeSelectionIndicator}
            />
            {showDecadeList &&
                <DecadeList
                    onDecadeSelect={handleSelectDecade}
                    focusOnFirst={true}
                />}
            {selectedDecade &&
                <YearSelectionIndicator
                    year={selectedYear}
                    onClick={handleClickYearSelectionIndicator}
                />}
            {showYearList && <YearList
                decade={selectedDecade}
                onYearSelect={handleSelectYear}
            />}
            {selectedYear && <SearchResultsButton />}
        </>
    );
}

export default YearSelectPanel;