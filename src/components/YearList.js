import { useRef, useEffect } from "react";
import FilterOption from "./FilterOption";

function YearList({ decade, onYearSelect }) {
    const yearRefs = useRef([]);
    const years = Array.from({ length: 10 }, (_, i) => decade + i);

    const handleKeyDown = (event, index) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (index < years.length - 1) {
                yearRefs.current[index + 1]?.focus();
            }
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (index > 0) {
                yearRefs.current[index - 1]?.focus();
            }
        } else if (event.key === "Enter") {
            onYearSelect(years[index]);
        }
    };

    return (
        <div id="year-list" role="listbox" aria-label="Year list">
            {years.map((year, index) => (
                <FilterOption
                    key={year}
                    id={year}
                    label={year}
                    onClick={onYearSelect}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (yearRefs.current[index] = el)}
                    isSelected={false} // you could hook this up to selectedYear if needed
                />
            ))}
        </div>
    );
}

export default YearList;
