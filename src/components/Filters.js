import '../css/Filters.css';
import { useState } from "react";
import SearchModeFilters from "./SearchModeFilters.js";
import InteractionModeSelector from "./InteractionModeSelector.js";
import ExploreModeFilters from "./ExploreModeFilters.js";

function Filters(){
    const [interactionMode, setInteractionMode] = useState('search');
    const inSearchMode = interactionMode === 'search';
    const inExploreMode = interactionMode === 'explore';

    const handleModeSelection = (selectedMode) => {
        setInteractionMode(selectedMode);
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