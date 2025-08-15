import {useContext, useEffect, useState} from "react";
import ConcertsContext from "../context/ConcertsContext";
import FilterOption from "./FilterOption";

function YearList({ decade, onYearSelect, optionRefs }) {
    const { selectedYear } = useContext(ConcertsContext);

    const yearRefs = optionRefs;
    const years = Array.from({ length: 10 }, (_, i) => decade + i);

    const [activeIndex, setActiveIndex] = useState(
        selectedYear ? years.findIndex(year => year === selectedYear) : 0
    );

    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex( prev => {
                const nextIndex = Math.min(prev + 1, years.length - 1);
                yearRefs.current[nextIndex]?.focus();
                return nextIndex;
            })
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex(prev => {
                const prevIndex = Math.max(prev - 1, 0);
                yearRefs.current[prevIndex]?.focus();
                return prevIndex;
            });
        } else if (event.key === "Enter") {
            event.preventDefault();
            onYearSelect(years[activeIndex]);
        } else if (event.key === "Home") {
            event.preventDefault();
            setActiveIndex(0);
            yearRefs.current[0]?.focus();
        } else if (event.key === "End") {
            event.preventDefault();
            const lastIndex = years.length - 1;
            setActiveIndex(lastIndex);
            yearRefs.current[lastIndex]?.focus();
        }

};

    const renderedYears = years.map((year, index) => (
        <FilterOption
            key={year}
            id={year}
            label={year}
            onClick={onYearSelect}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (yearRefs.current[index] = el)}
            isSelected={ selectedYear === year }
            isActive={index === activeIndex}
        />
    ))

    return (
        <div id="year-list"
             role="listbox"
             aria-label="Year list"
         aria-activedescendant={`option-${years[activeIndex]}`}
             onKeyDown={handleKeyDown}
        >
            {renderedYears}
        </div>
    );
}

export default YearList;
