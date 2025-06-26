import { useRef, useEffect } from "react";

function YearList({ decade, onYearSelect }){
    const yearRefs = useRef([]);

    const years = Array.from({length: 10}, (_, i)=> decade + i);

    return (
        <div id='year-list'>
            {years.map((year, index)=> (
                <div
                    key={year}
                    className='year filter-option'
                    data-id={year.toString()}
                    tabIndex={-1}
                    ref={(el) => yearRefs.current[index] = el}
                    onClick={()=>onYearSelect(year)}
                >
                    <h3>{year}</h3>
                </div>
            ))}
        </div>
    );
}

export default YearList;