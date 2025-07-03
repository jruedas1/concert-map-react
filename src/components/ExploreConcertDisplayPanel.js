import { useContext } from "react";
import GenresContext from "../context/GenresContext.js";
import AnimationContext from "../context/AnimationContext.js";
import ChangeSelectionsPrompt from "./ChangeSelectionsPrompt.js";
import DateRangeGenreIndicator from "./DateRangeGenreIndicator.js";
import ConcertList from "./ConcertList.js";

function ExploreConcertDisplayPanel() {
    const { selectedGenre, startYear, endYear } = useContext(GenresContext);
    const { genreConcerts, genreConcertIndex } = useContext(AnimationContext);

    const visibleConcerts = genreConcerts
        .slice(0, genreConcertIndex + 1)
        .slice()
        .reverse();

    return (
      <>
        <ChangeSelectionsPrompt divId="change-range-genre-div" />
        <DateRangeGenreIndicator
            selectedGenre={selectedGenre}
            startYear={startYear}
            endYear={endYear}
        />
        <ConcertList concerts={visibleConcerts} />
      </>
    );
}

export default ExploreConcertDisplayPanel;