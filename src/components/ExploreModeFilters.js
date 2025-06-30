import { useState, useContext } from "react";
import GenresContext from "../context/GenresContext.js";
import DateRangeSelectionIndicator from "./DateRangeSelectionIndicator.js";
import DualDropdownSection from "./DualDropdownSection.js";
import SelectGenreButton from "./SelectGenreButton.js";
import GenreSelectionIndicator from "./GenreSelectionIndicator.js";
import GenreList from "./GenreList.js";

function ExploreModeFilters(){

    const [rangeSelected, setRangeSelected] = useState(false);
    const [showRangeSelection, setShowRangeSelection] = useState(true);
    const [showGenreList, setShowGenreList] = useState(false);
    const { startYear, endYear } = useContext(GenresContext);

    const handleClickSelectGenre = () => {
        setRangeSelected(true);
        setShowRangeSelection(false)
        setShowGenreList(true);
    }

    return (
        <section>
            <DateRangeSelectionIndicator
               rangeSelected={rangeSelected}
               startYear={startYear}
               endYear={endYear}
            />
            {showRangeSelection && <DualDropdownSection />}
            {showRangeSelection && <SelectGenreButton  onClick={handleClickSelectGenre} />}
            {showGenreList && <GenreSelectionIndicator />}
            {showGenreList && <GenreList />}
        </section>
    );
}

export default ExploreModeFilters;