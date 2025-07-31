import '../css/Filters.css';
import { useState, useContext } from "react";
import SearchModeFilters from "./SearchModeFilters.js";
import InteractionModeSelector from "./InteractionModeSelector.js";
import ExploreModeFilters from "./ExploreModeFilters.js";
import AnimationContext from "../context/AnimationContext";
import {removeMarkers} from "../utils/mapUtils";

function Filters(){
    const [interactionMode, setInteractionMode] = useState('search');
    const { resetAnimation } = useContext(AnimationContext);
    const inSearchMode = interactionMode === 'search';
    const inExploreMode = interactionMode === 'explore';

    const handleModeSelection = (selectedMode) => {
        setInteractionMode(selectedMode);
        if (interactionMode === 'explore' && selectedMode === 'search') resetAnimation();
        if (interactionMode !== selectedMode) removeMarkers();
    }

    return (
      <section id='filters'>
          <InteractionModeSelector
              onModeSelect={handleModeSelection}
              interactionMode={interactionMode}
          />
          {inSearchMode && <SearchModeFilters />}
          {inExploreMode && <ExploreModeFilters />}
      </section>
    );
}

export default Filters;