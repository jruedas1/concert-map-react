import GenreShow from "./GenreShow.js";

function GenreList({ genres, handleGenreClick }) {

    const renderedGenres = genres.map(genre => (
        <GenreShow
            key={genre['id']}
            genre={genre['name']}
            id={genre['id']}
            onClick={handleGenreClick}
        />
    ));
    return (
        <div id="genre-list">
            {renderedGenres}
        </div>
    );
}

export default GenreList;