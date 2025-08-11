function YearSelectionIndicator({ year, onClick, isListOpen, onArrowDown }){
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        } else if (e.key === "ArrowDown"){
            e.preventDefault();
            if (isListOpen) onArrowDown();
        }
    };

    return (
        <div id='years'
             className={`filter ${year? 'selected-filter' : ''}`}
             tabIndex={0}
             onClick={onClick}
             onKeyDown={handleKeyDown}
        >
            {!year && <h3>SELECT A YEAR</h3>}
            {year && <h3>{year}</h3>}
            <p className={`edit ${!year ? 'hidden' : ''}`}>Change Year</p>
        </div>
    );
}

export default YearSelectionIndicator;