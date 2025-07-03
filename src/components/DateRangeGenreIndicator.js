function DateRangeGenreIndicator({ startYear, endYear, selectedGenre }) {

    return (
        <div id="range-genre-breadcrumb-flex-parent">
            <h2 id="year-range-breadcrumb">{startYear} - {endYear}</h2>
            <p id="genre-breadcrumb">{ selectedGenre.genre }</p>
        </div>
    );
}

export default DateRangeGenreIndicator;