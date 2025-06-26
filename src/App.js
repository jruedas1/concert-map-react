import { useContext, useEffect } from "react";
import './css/App.css';
import Filters from './components/Filters.js';
import Map from './components/Map.js';
import ConcertsContext from "./context/ConcertsContext.js";
import { fetchYear } from "./services/dataAccess.js";

function App(){
    const { confirmedYear, venues, updateVenues } = useContext(ConcertsContext);

    useEffect(()=>{
        const getVenues = async () => {
            const year = await fetchYear(confirmedYear);
            updateVenues(year.venues);
        }
       if (confirmedYear) {
           getVenues();
       }
    }, [confirmedYear]);

    return (
        <div id='page-wrapper'>
            <main>
                <Filters />
                <Map venues={venues} />
            </main>
        </div>
    );
}

export default App;