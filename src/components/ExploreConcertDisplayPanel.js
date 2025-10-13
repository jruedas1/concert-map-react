import { useContext } from "react";
import GenresContext from "../context/GenresContext.js";
import AnimationContext from "../context/AnimationContext.js";
import ViewportContext from "../context/ViewportContext";
import ChangeSelectionsPrompt from "./ChangeSelectionsPrompt.js";
import DateRangeGenreIndicator from "./DateRangeGenreIndicator.js";
import ConcertList from "./ConcertList.js";

function ExploreConcertDisplayPanel({ onChangeSelection }) {
    const { selectedGenre, startYear, endYear } = useContext(GenresContext);
    const { genreConcerts, genreConcertIndex } = useContext(AnimationContext);
    const { isMobile, view } = useContext(ViewportContext);

    const visibleConcerts = genreConcerts
        .slice(0, genreConcertIndex + 1)
        .slice()
        .reverse();

    return (
      <>
        <ChangeSelectionsPrompt divId="change-range-genre-div" onClick={onChangeSelection} />
        <DateRangeGenreIndicator
            selectedGenre={selectedGenre}
            startYear={startYear}
            endYear={endYear}
        />
          {!isMobile || (isMobile && view === "list") &&  <ConcertList concerts={visibleConcerts} />}
      </>
    );
}

export default ExploreConcertDisplayPanel;