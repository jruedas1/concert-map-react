import { useContext } from "react";
import ConcertsContext from "../context/ConcertsContext.js";
import YearSelectPanel from "./YearSelectPanel.js";
import VenuesPanel from './VenuesPanel.js';

function SearchModeFilters() {
   const { confirmedYear } = useContext(ConcertsContext);
   return (
     <>
         {!confirmedYear && <YearSelectPanel />}
         {confirmedYear && <VenuesPanel />}
     </>
   );
}

export default SearchModeFilters;