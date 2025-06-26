function YearSelectionIndicator({ year, onClick }){
    return (
        <div id='years' className='filter' tabIndex={0} onClick={onClick}>
            {!year && <h3>SELECT A YEAR</h3>}
            {year && <h3>{year}</h3>}
            <p className={`edit ${!year ? 'hidden' : ''}`} tabIndex={0}>Change Year</p>
        </div>
    );
}

export default YearSelectionIndicator;