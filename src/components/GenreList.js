import GenreShow from "./GenreShow.js";

function GenreList({ genres }) {
    const renderedGenres = genres.map(genre => (
        <GenreShow key={genre['id']} genre={genre['name']} id={genre['id']} />
    ))
    return (
        <div id="genre-list">
            {renderedGenres}
        </div>
    );
}

export default GenreList;