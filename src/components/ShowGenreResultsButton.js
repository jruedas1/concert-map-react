function ShowGenreResultsButton({ startYear, endYear, genre, onClick }) {
    return (
        <div id="confirm-genre-parent"
             className="confirm"
             onClick={()=>onClick(startYear, endYear, genre)}
        >
            <button id="confirm-genre-selection" className="next">SHOW MY RESULTS</button>
        </div>
    );
}

export default ShowGenreResultsButton;