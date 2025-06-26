import '../css/VenuesPanel.css';
import ChangeSelectionsPrompt from "./ChangeSelectionsPrompt.js";
import YearVenuesIndicator from "./YearVenuesIndicator.js";
import VenueList from "./VenueList.js";
import ConcertList from "./ConcertList.js";
import {useContext, useState} from "react";
import ConcertsContext from "../context/ConcertsContext.js";

function VenuesPanel(){
    const { venues, unsetConfirmedYear } = useContext(ConcertsContext);
    const [showVenues, setShowVenues] = useState(true);
    const [selectedVenue, setSelectedVenue] = useState(null);


    const handleChangeSelections = () => {
        unsetConfirmedYear();
    }

    const handleVenueClick = (venue) => {
        setSelectedVenue(venue);
    }

    return (
      <>
          <ChangeSelectionsPrompt onClick={handleChangeSelections} />
          <YearVenuesIndicator />
          {!selectedVenue && <VenueList venues={venues} onVenueClick={handleVenueClick}/>}
          {selectedVenue && <ConcertList venue={selectedVenue} />}
      </>
    );
}

export default VenuesPanel;