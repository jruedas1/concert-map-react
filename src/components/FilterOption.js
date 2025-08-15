import { forwardRef } from "react";

const FilterOption = forwardRef(({ label, id, onClick, isSelected, isActive }, ref) => (
    <div
        id={`option-${id}`}
        className={`filter-option 
            ${isSelected ? "selected-filter" : ""}
            ${isActive ? "active-filter" : ""}`}
        data-id={id}
        role="option"
        aria-selected={isSelected}
        tabIndex={-1}
        onClick={() => onClick(id)}
        ref={ref}
    >
        <h3>{label}</h3>
    </div>
));

export default FilterOption;