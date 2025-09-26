import '../css/Filters.css';
import { useContext } from "react";
import ConcertsContext from "../context/ConcertsContext";
import ViewportContext from "../context/ViewportContext";
import SearchModeFilters from "./SearchModeFilters.js";
import InteractionModeSelector from "./InteractionModeSelector.js";
import ExploreModeFilters from "./ExploreModeFilters.js";

function Filters({ onModeSelect, interactionMode }){
    const inSearchMode = interactionMode === 'search';
    const inExploreMode = interactionMode === 'explore';

    const { confirmedYear } = useContext(ConcertsContext);
    const { isMobile } = useContext(ViewportContext);

    const showSelector = !isMobile || (isMobile && !confirmedYear);

    return (
      <section id='filters'>
          {showSelector && <InteractionModeSelector
              onModeSelect={onModeSelect}
              interactionMode={interactionMode}
          />}
          {inSearchMode && <SearchModeFilters />}
          {inExploreMode && <ExploreModeFilters />}
      </section>
    );
}

export default Filters;