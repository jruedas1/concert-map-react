import { createContext, useState } from "react";

const ConcertsContext = createContext();

function Provider({ children }){
    const [selectedDecade, setSelectedDecade] = useState(undefined);
    const [showDecadeList, setShowDecadeList] = useState(true);
    const [selectedYear, setSelectedYear] = useState(undefined);
    const [confirmedYear, setConfirmedYear] = useState(undefined);
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [hoveredMarkerVenueId, setHoveredMarkerVenueId] = useState(null);
    const [hoveredVenueId, setHoveredVenueId] = useState(null);


    const year = {
        selectedDecade,
        updateSelectedDecade: (decade) => setSelectedDecade(decade),
        showDecadeList,
        updateShowDecadeList: (bool) => setShowDecadeList(bool),
        selectedYear,
        updateSelectedYear: (userYearSelection) => {
            setSelectedYear(userYearSelection)
        },
        confirmedYear,
        confirmYearSelection: () => setConfirmedYear(selectedYear),
        unsetConfirmedYear: () => setConfirmedYear(undefined),
        venues,
        updateVenues: (retrievedVenues) => {
            setVenues(retrievedVenues);
        },
        selectedVenue,
        setSelectedVenue,
        hoveredMarkerVenueId,
        setHoveredMarkerVenueId,
        hoveredVenueId,
        setHoveredVenueId
    }

    return (
      <ConcertsContext.Provider value={year}>
          {children}
      </ConcertsContext.Provider>
    );
}

export { Provider };
export default ConcertsContext;