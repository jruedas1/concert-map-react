import FilterOption from "./FilterOption";

function DecadeList({ onDecadeSelect, optionRefs }) {
    const decades = [
        { id: 1970, label: "1970s" },
        { id: 1980, label: "1980s" },
        { id: 1990, label: "1990s" },
        { id: 2000, label: "2000s" },
    ];

    const handleKeyDown = (e, index) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            optionRefs.current[index + 1]?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            optionRefs.current[index - 1]?.focus();
        } else if (e.key === "Enter") {
            onDecadeSelect(decades[index].id);
        }
    };

    return (
        <div id="decade-list" role="listbox" aria-label="Decade list">
            {decades.map(({ id, label }, index) => (
                <FilterOption
                    key={id}
                    id={id}
                    label={label}
                    onClick={onDecadeSelect}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (optionRefs.current[index] = el)}
                    isSelected={false}
                />
            ))}
        </div>
    );
}

export default DecadeList;
