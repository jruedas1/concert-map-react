import { useState, useContext, useRef } from "react";
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

    const decadeListRefs = useRef([]);
    const yearListRefs = useRef([]);
    const focusFirstDecade = () => decadeListRefs.current[0].focus();
    const focusFirstYear = () => yearListRefs.current[0].focus();

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
                isListOpen={showDecadeList}
                onArrowDown={focusFirstDecade}
            />
            {showDecadeList &&
                <DecadeList
                    onDecadeSelect={handleSelectDecade}
                    optionRefs={decadeListRefs}
                />}
            {selectedDecade &&
                <YearSelectionIndicator
                    year={selectedYear}
                    onClick={handleClickYearSelectionIndicator}
                    isListOpen={showYearList}
                    onArrowDown={focusFirstYear}
                />}
            {showYearList && <YearList
                decade={selectedDecade}
                onYearSelect={handleSelectYear}
                optionRefs={yearListRefs}
            />}
            {selectedYear && <SearchResultsButton />}
        </>
    );
}

export default YearSelectPanel;