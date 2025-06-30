function GenreShow({ genre, id, onClick }) {
    return (
        <div
            className="genre filter-option"
            data-id={id}
            tabIndex={0}
            onClick={()=>onClick(genre, id)}
        >
            <h3>{genre.toUpperCase()}</h3>
        </div>
    );
}

export default GenreShow;