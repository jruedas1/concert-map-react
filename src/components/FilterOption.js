import { forwardRef } from "react";

const FilterOption = forwardRef(({ label, id, onClick, onKeyDown, isSelected }, ref) => (
    <div
        className={`filter-option ${isSelected ? "selected" : ""}`}
        data-id={id}
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        onClick={() => onClick(id)}
        onKeyDown={onKeyDown}
        ref={ref}
    >
        <h3>{label}</h3>
    </div>
));

export default FilterOption;