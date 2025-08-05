import { useState, useEffect, useRef } from "react";

function Dropdown ({ options, value, onChange }) {

    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const optionsRef = useRef([]);
    const buttonRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
        setFocusedIndex(-1);
    };

    const handleOptionClick = (year) => {
        onChange(year);
        setIsOpen(false);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault(); // prevent scrolling on space
            toggleDropdown();
        }
        if (e.key === "ArrowDown" && isOpen) {
            e.preventDefault();
            setFocusedIndex(0); // move into options only if already open
        }
    };

    useEffect(() => {
        if (isOpen && focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
            optionsRef.current[focusedIndex].focus();
        }
    }, [focusedIndex, isOpen]);

    const renderedOptions = options.map((option, index) => (
        <div
            key={option}
            ref={el => optionsRef.current[index] = el}
            className={`custom-option ${option === value ? "same-as-selected" : ""}`}
            onClick={() => handleOptionClick(option)}
            tabIndex={-1}
            role="option"
            aria-selected={option === value}
            onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (index < options.length - 1) {
                        setFocusedIndex(index + 1);
                    }
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (index > 0) {
                        setFocusedIndex(index - 1);
                    }
                } else if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOptionClick(option);
                    buttonRef.current?.focus();
                } else if (e.key === "Escape"){
                    e.preventDefault();
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    buttonRef.current?.focus();
                }
            }}
        >
            {option}
        </div>
    ));


    return (
        <div className="selected-and-options-flex-wrapper">
            <div
                className={`custom-selector select-selected ${isOpen ? "select-arrow-active" : ""}`}
                ref={buttonRef}
                tabIndex={0}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                role="button"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                {value}
            </div>
            <div className='custom-select-option-wrapper'>
                {isOpen && <div
                    className='custom-options select-items'
                    role="listbox"
                >
                    {renderedOptions}
                </div>}
            </div>
        </div>
    );
}

export default Dropdown;