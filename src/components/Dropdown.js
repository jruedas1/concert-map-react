import { useState, useContext } from "react";
import DropdownOptions from "./DropdownOptions.js";
import GenresContext from "../context/GenresContext.js";

function Dropdown ({ options, selectedYear, onSelect, id }) {

    const [isOpen, setIsOpen] = useState(false);
    const { startYear, setStartYear, endYear, setEndYear } = useContext(GenresContext);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleOptionClick = (year) => {
        onSelect(year);
        if (id.includes("end")) {
            if (year < startYear) setStartYear(year);
        }
        if (id.includes("start")) {
            if (year > endYear) setEndYear(year);
        }
        setIsOpen(false);
    }

    const renderedOptions = options.map((year) => (
        <div
            key={year}
            className={`custom-option ${year === selectedYear ? "same-as-selected" : ""}`}
            onClick={() => handleOptionClick(year)}
        >
            {year}
        </div>
    ));


    return (
        <div className="selected-and-options-flex-wrapper">
            <div
                className={`custom-selector select-selected ${isOpen ? "select-arrow-active" : ""}`}
                tabIndex={0}
                onClick={toggleDropdown}
            >
                {selectedYear}
            </div>
            <div className='custom-select-option-wrapper'>
                {isOpen && <div className='custom-options select-items'>
                    {renderedOptions}
                </div>}
            </div>
        </div>
    );
}

export default Dropdown;