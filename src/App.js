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
import SingleConcert from "./components/SingleConcert";

function App(){
    const { isMobile, singleVenueMode, setSingleVenueMode, view } = useContext(ViewportContext);
    const { confirmedYear,
        venues,
        updateVenues,
        selectedVenue
    } = useContext(ConcertsContext);
    const { resetAnimation, genreConcerts, genreConcertIndex } = useContext(AnimationContext);
    const [showModal, setShowModal] = useState(true);
    const [interactionMode, setInteractionMode] = useState('search');

    useEffect(()=>{
        const getVenues = async () => {
            const year = await fetchYear(confirmedYear);
            updateVenues(year.venues.features.map(v => ({
                ...v,
                longitude: v.geometry ? v.geometry.coordinates[0] : null,
                latitude: v.geometry ? v.geometry.coordinates[1] : null,
                id: v.properties.id,
                name: v.properties.name,
                address: v.properties.address,
                city: v.properties.city,
                zip: v.properties.zip,
                concerts: v.properties.concerts
            })));
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
                <Map venues={venues} interactionMode={interactionMode} />
                {(isMobile && singleVenueMode && selectedVenue) && (
                    <SingleVenue
                        venue={selectedVenue}
                        onClick={handleSingleVenueClick}
                    />
                )}
                {(view === 'map' && isMobile && genreConcerts.length > 0) && <SingleConcert index={genreConcertIndex} concert={genreConcerts[genreConcertIndex]} />}
                {showModal && <Modal onClose={handleModalClose} onExploreClick={handleModalButtonClick} />}
            </main>
        </div>
    );
}

export default App;