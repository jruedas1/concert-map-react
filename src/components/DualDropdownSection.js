import { useContext, useEffect } from "react";
import '../css/DualDropdownSection.css';
import Dropdown from "./Dropdown";
import GenresContext from "../context/GenresContext.js";

const createYearOptions = (start, end) => {
    const yearOptions = [];
    for (let i = start; i <= end; i++){
        yearOptions.push(i);
    }
    return yearOptions;
}

const startOptions=createYearOptions(1970, 2005);
const endOptions=createYearOptions(1970, 2009);

function DualDropdownSection(){

    const { startYear, setStartYear, endYear, setEndYear } = useContext(GenresContext);

    return (
        <div id="custom-selector-wrapper">
           <Dropdown
               id="custom-start-range-selector"
               options={startOptions}
               selectedYear={startYear}
               onSelect={setStartYear}
           />
           <div id="range-selection-state">to</div>
           <Dropdown
               id="custom-end-range-selector"
               options={endOptions}
               selectedYear={endYear}
               onSelect={setEndYear}
           />
        </div>
    );
}

export default DualDropdownSection;