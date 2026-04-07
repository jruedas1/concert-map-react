import { useContext } from "react";
import GenresContext from "../context/GenresContext.js";
import AnimationContext from "../context/AnimationContext.js";
import ViewportContext from "../context/ViewportContext";
import ChangeSelectionsPrompt from "./ChangeSelectionsPrompt.js";
import DateRangeGenreIndicator from "./DateRangeGenreIndicator.js";
import ConcertList from "./ConcertList.js";

function ExploreConcertDisplayPanel({ onChangeSelection }) {
    const { selectedGenre, startYear, endYear } = useContext(GenresContext);
    const { genreConcerts, genreConcertIndex, isAnimating } = useContext(AnimationContext);
    const { isMobile, view } = useContext(ViewportContext);

    const visibleConcerts = genreConcerts
        .slice(0, genreConcertIndex + 1)
        .slice()
        .reverse();

    // this is to fix an async gap where the component has rendered
    // We don't want the Missing a Concert? div showing up until
    // the animation is done running ... but if we hitch it
    // only to "isAnimating" it will show for a split second
    // when the component renders but before the animation flag
    // has flipped to true
    const animationPending = isAnimating || genreConcertIndex === -1;

    return (
      <>
        <ChangeSelectionsPrompt divId="change-range-genre-div" onClick={onChangeSelection} />
        <DateRangeGenreIndicator
            selectedGenre={selectedGenre}
            startYear={startYear}
            endYear={endYear}
        />
        {(!isMobile || (isMobile && view === "list")) &&
            <ConcertList concerts={visibleConcerts} isAnimating={animationPending} />}
      </>
    );
}

export default ExploreConcertDisplayPanel;