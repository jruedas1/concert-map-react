import { useContext } from "react";
import AnimationContext from "../context/AnimationContext.js";
import ExploreSelectGenrePanel from "./ExploreSelectGenrePanel.js";
import ExploreConcertDisplayPanel from "./ExploreConcertDisplayPanel.js";

function ExploreModeFilters() {
    const { genreConcerts } = useContext(AnimationContext);

    return (
        <>
            {genreConcerts.length === 0 && <ExploreSelectGenrePanel />}
            {genreConcerts.length > 0 && <ExploreConcertDisplayPanel />}
        </>
    );
}

export default ExploreModeFilters;
