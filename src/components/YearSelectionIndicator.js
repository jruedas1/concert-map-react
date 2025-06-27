function YearSelectionIndicator({ year, onClick }){
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
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