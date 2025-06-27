import '../css/VenuesPanel.css';
import ChangeSelectionsPrompt from "./ChangeSelectionsPrompt.js";
import YearVenuesIndicator from "./YearVenuesIndicator.js";
import VenueList from "./VenueList.js";
import YearConcertsIndicator from "./YearConcertsIndicator.js";
import ConcertList from "./ConcertList.js";
import {useContext, useState} from "react";
import ConcertsContext from "../context/ConcertsContext.js";
import ChangeVenuesPrompt from "./ChangeVenuesPrompt.js";

function VenuesPanel(){
    const { venues, confirmedYear, unsetConfirmedYear } = useContext(ConcertsContext);
    const [selectedVenue, setSelectedVenue] = useState(null);


    const handleChangeSelections = () => {
        unsetConfirmedYear();
    }

    const handleVenueClick = (venue) => {
        setSelectedVenue(venue);
    }

    const handleBackToVenuesClick = () => {
        setSelectedVenue(null);
    }

    return (
      <>
          {!selectedVenue &&
              <>
                  <ChangeSelectionsPrompt onClick={handleChangeSelections} />
                  <YearVenuesIndicator />
                  <VenueList venues={venues} onVenueClick={handleVenueClick}/>
              </>
          }

          {selectedVenue &&
            <>
                <ChangeVenuesPrompt onClick={handleBackToVenuesClick} />
                <YearConcertsIndicator year={confirmedYear} venue={selectedVenue} />
                <ConcertList venue={selectedVenue} />
            </>
          }
      </>
    );
}

export default VenuesPanel;