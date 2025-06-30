function GenreShow({ genre, id }) {
    return (
        <div
            className="genre filter-option"
            data-id={id}
            tabIndex={0}
        >
            <h3>{genre.toUpperCase()}</h3>
        </div>
    );
}

export default GenreShow;