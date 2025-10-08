import '../css/VenuesPanel.css';
import ChangeSelectionsPrompt from "./ChangeSelectionsPrompt.js";
import YearVenuesIndicator from "./YearVenuesIndicator.js";
import VenueList from "./VenueList.js";
import YearConcertsIndicator from "./YearConcertsIndicator.js";
import ConcertList from "./ConcertList.js";
import { useContext } from "react";
import ConcertsContext from "../context/ConcertsContext.js";
import ViewportContext from "../context/ViewportContext";
import ChangeVenuesPrompt from "./ChangeVenuesPrompt.js";

function VenuesPanel(){
    const { venues, confirmedYear, unsetConfirmedYear, showSingleVenue, setShowSingleVenue } = useContext(ConcertsContext);
    const { selectedVenue, setSelectedVenue } = useContext(ConcertsContext);
    const { singleVenueMode, setSingleVenueMode } = useContext(ViewportContext);

    const handleChangeSelections = () => {
        unsetConfirmedYear();
        setSingleVenueMode(false);
    }

    const handleVenueClick = (venue) => {
        setSelectedVenue(venue);
        setSingleVenueMode(false);
    }

    const handleBackToVenuesClick = () => {

            setSelectedVenue(null);
            if (selectedVenue) setSingleVenueMode(true);
    }

    return (
      <>
          {(!selectedVenue || singleVenueMode) && (
              <>
                  <ChangeSelectionsPrompt
                      divId="back-to-year-edit-div"
                      onClick={handleChangeSelections} />
                  <YearVenuesIndicator />
                  <VenueList
                      venues={venues}
                      onVenueClick={handleVenueClick}
                  />
              </>
          )}

          {selectedVenue && !singleVenueMode && (
            <>
                <ChangeVenuesPrompt onClick={handleBackToVenuesClick} />
                <YearConcertsIndicator year={confirmedYear} venue={selectedVenue} />
                <ConcertList concerts={selectedVenue.concerts} />
            </>
          )}
      </>
    );
}

export default VenuesPanel;