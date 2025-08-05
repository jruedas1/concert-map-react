function DateRangeSelectionIndicator({ rangeSelected, startYear, endYear, onClick }) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div id="year-range"
             className={`filter ${rangeSelected ? 'explore-selected-filter' : ''}`}
             onClick={onClick}
        >
            {!rangeSelected && <h3>SELECT A DATE RANGE</h3>}
            {rangeSelected && <h3>{startYear}-{endYear}</h3>}
            {rangeSelected && <p
                className="edit"
                tabIndex="0"
                onKeyDown={handleKeyDown}
            >
                Edit
            </p>}
        </div>
    );
}

export default DateRangeSelectionIndicator;