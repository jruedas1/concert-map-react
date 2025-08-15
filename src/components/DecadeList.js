import {useContext, useRef, useState} from "react";
import ConcertsContext from "../context/ConcertsContext";
import FilterOption from "./FilterOption";

function DecadeList({ onDecadeSelect, optionRefs }) {

    const { selectedDecade } = useContext(ConcertsContext);

    const decades = [
        { id: 1970, label: "1970s" },
        { id: 1980, label: "1980s" },
        { id: 1990, label: "1990s" },
        { id: 2000, label: "2000s" },
    ];

    const [activeIndex, setActiveIndex] = useState(
        selectedDecade ? decades.findIndex(decade => decade.id === selectedDecade.id) : 0
    );

    const listRef = useRef(null);

    const handleKeyDown = (e, index) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(prev => {
                const nextIndex = Math.min(prev + 1, decades.length - 1);
                optionRefs.current[nextIndex]?.focus();
                return nextIndex;
            })
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(prev => {
                const nextIndex = Math.max(prev - 1, 0);
                optionRefs.current[nextIndex]?.focus();
                return nextIndex;
            })
        } else if (e.key === "Enter") {
            onDecadeSelect(decades[activeIndex].id);
        }
    };

    return (
        <div id="decade-list"
             ref={listRef}
             role="listbox"
             aria-activedescendant={`option-${decades[activeIndex]}.id`}
             aria-label="Decade list"
             tabIndex={0}
             onKeyDown={handleKeyDown}
        >
            {decades.map(({ id, label }, index) => (
                <FilterOption
                    key={id}
                    id={id}
                    label={label}
                    onClick={onDecadeSelect}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (optionRefs.current[index] = el)}
                    isSelected={selectedDecade === id}
                    isActive={index === activeIndex}
                />
            ))}
        </div>
    );
}

export default DecadeList;
