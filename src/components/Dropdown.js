import { useState, useContext } from "react";

function Dropdown ({ options, value, onChange }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleOptionClick = (year) => {
        onChange(year);
        setIsOpen(false);
    }

    const renderedOptions = options.map((option) => (
        <div
            key={option}
            className={`custom-option ${option === value ? "same-as-selected" : ""}`}
            onClick={() => handleOptionClick(option)}
        >
            {option}
        </div>
    ));


    return (
        <div className="selected-and-options-flex-wrapper">
            <div
                className={`custom-selector select-selected ${isOpen ? "select-arrow-active" : ""}`}
                tabIndex={0}
                onClick={toggleDropdown}
            >
                {value}
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