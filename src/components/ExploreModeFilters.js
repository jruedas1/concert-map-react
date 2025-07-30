import { useContext, useState } from "react";
import AnimationContext from "../context/AnimationContext.js";
import GenresContext from "../context/GenresContext";
import ExploreSelectGenrePanel from "./ExploreSelectGenrePanel.js";
import ExploreConcertDisplayPanel from "./ExploreConcertDisplayPanel.js";

function ExploreModeFilters() {
    const { genreConcerts, setGenreConcerts, setGenreConcertIndex, stopAnimation } = useContext(AnimationContext);
    const { setSelectedGenre } = useContext(GenresContext);

    const [resetTrigger, setResetTrigger] = useState(0);

    const handleChangeSelection = () => {
        stopAnimation();
        setGenreConcerts([]);
        setGenreConcertIndex(-1);
        setSelectedGenre(null);
        setResetTrigger(prev => prev + 1);
    }

    return (
        <>
            {genreConcerts.length === 0 && <ExploreSelectGenrePanel resetTrigger={resetTrigger} />}
            {genreConcerts.length > 0 && <ExploreConcertDisplayPanel onChangeSelection={handleChangeSelection} />}
        </>
    );
}

export default ExploreModeFilters;
