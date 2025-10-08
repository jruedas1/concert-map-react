import { useContext, useEffect, useState } from "react";
import './css/App.css';
import Filters from './components/Filters.js';
import Map from './components/Map.js';
import Modal from "./components/Modal";
import ConcertsContext from "./context/ConcertsContext.js";
import AnimationContext from "./context/AnimationContext";
import ViewportContext from "./context/ViewportContext";
import { fetchYear } from "./services/dataAccess.js";
import {removeMarkers} from "./utils/mapUtils";
import SingleVenue from "./components/SingleVenue";

function App(){
    const { isMobile, singleVenueMode, setSingleVenueMode } = useContext(ViewportContext);
    const { confirmedYear,
        venues,
        updateVenues,
        selectedVenue
    } = useContext(ConcertsContext);
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

    const handleSingleVenueClick = () => {
        setSingleVenueMode(false);
    }

    return (
        <div id="page-wrapper">
            <main>
                <Filters onModeSelect={handleModeSelection} interactionMode={interactionMode} />
                <Map venues={venues} />
                {(isMobile && singleVenueMode && selectedVenue) && (
                    <SingleVenue
                        venue={selectedVenue}
                        onClick={handleSingleVenueClick}
                    />
                )}
                {showModal && <Modal onClose={handleModalClose} onExploreClick={handleModalButtonClick} />}
            </main>
        </div>
    );
}

export default App;