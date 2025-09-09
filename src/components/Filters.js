import '../css/Filters.css';
import { useContext } from "react";
import SearchModeFilters from "./SearchModeFilters.js";
import InteractionModeSelector from "./InteractionModeSelector.js";
import ExploreModeFilters from "./ExploreModeFilters.js";

function Filters({ onModeSelect, interactionMode }){
    const inSearchMode = interactionMode === 'search';
    const inExploreMode = interactionMode === 'explore';

    return (
      <section id='filters'>
          <InteractionModeSelector
              onModeSelect={onModeSelect}
              interactionMode={interactionMode}
          />
          {inSearchMode && <SearchModeFilters />}
          {inExploreMode && <ExploreModeFilters />}
      </section>
    );
}

export default Filters;