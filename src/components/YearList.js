import { useContext } from "react";
import ConcertsContext from "../context/ConcertsContext";
import FilterOption from "./FilterOption";

function YearList({ decade, onYearSelect, optionRefs }) {
    const { selectedYear } = useContext(ConcertsContext);

    const yearRefs = optionRefs;
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

    const renderedYears = years.map((year, index) => (
        <FilterOption
            key={year}
            id={year}
            label={year}
            onClick={onYearSelect}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (yearRefs.current[index] = el)}
            isSelected={ selectedYear === year }
        />
    ))

    return (
        <div id="year-list" role="listbox" aria-label="Year list">
            {renderedYears}
        </div>
    );
}

export default YearList;
