import { createContext, useState } from "react";

const ConcertsContext = createContext();

function Provider({ children }){
    const [selectedDecade, setSelectedDecade] = useState(undefined);
    const [showDecadeList, setShowDecadeList] = useState(true);
    const [selectedYear, setSelectedYear] = useState(undefined);
    const [confirmedYear, setConfirmedYear] = useState(undefined);
    const [venues, setVenues] = useState([]);

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
        }
    }

    return (
      <ConcertsContext.Provider value={year}>
          {children}
      </ConcertsContext.Provider>
    );
}

export { Provider };
export default ConcertsContext;