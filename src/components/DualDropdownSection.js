import { useContext } from "react";
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

    const handleStartYearChange = (newStart) => {
        setStartYear(newStart);
        if (newStart > endYear) {
            setEndYear(newStart);
        }
    };

    const handleEndYearChange = (newEnd) => {
        setEndYear(newEnd);
        if (newEnd < startYear) {
            setStartYear(newEnd);
        }
    };

    return (
        <div id="custom-selector-wrapper">
            <Dropdown
                options={startOptions}
                value={startYear}
                onChange={handleStartYearChange}
            />
            <div id="range-selection-state">to</div>
            <Dropdown
                options={endOptions}
                value={endYear}
                onChange={handleEndYearChange}
            />
        </div>
    );
}

export default DualDropdownSection;