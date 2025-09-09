import { useContext, useEffect, useState } from "react";
import './css/App.css';
import Filters from './components/Filters.js';
import Map from './components/Map.js';
import Modal from "./components/Modal";
import ConcertsContext from "./context/ConcertsContext.js";
import AnimationContext from "./context/AnimationContext";
import { fetchYear } from "./services/dataAccess.js";
import {removeMarkers} from "./utils/mapUtils";

function App(){
    const { confirmedYear, venues, updateVenues } = useContext(ConcertsContext);
    const { resetAnimation } = useContext(AnimationContext);
    const [showModal, setShowModal] = useState(true);
    const [interactionMode, setInteractionMode] = useState('search');

    useEffect(()=>{
        const getVenues = async () => {
            const year = await fetchYear(confirmedYear);
            updateVenues(year.venues);
        }
       if (confirmedYear) {
           getVenues();
       }
    }, [confirmedYear]);

    const handleModeSelection = (selectedMode) => {
        setInteractionMode(selectedMode);
        if (interactionMode === 'explore' && selectedMode === 'search') resetAnimation();
        if (interactionMode !== selectedMode) removeMarkers();
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    const handleModalButtonClick = () => {
        setInteractionMode('explore');
    }

    return (
        <div id="page-wrapper">
            <main>
                <Filters onModeSelect={handleModeSelection} interactionMode={interactionMode} />
                <Map venues={venues} />
                {showModal && <Modal onClose={handleModalClose} onExploreClick={handleModalButtonClick} />}
            </main>
        </div>
    );
}

export default App;