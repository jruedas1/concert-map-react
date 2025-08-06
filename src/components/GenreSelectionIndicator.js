function GenreSelectionIndicator({ onClick, genreSelected, selectedGenre }) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            id="genres"
            className={`filter ${genreSelected? 'explore-selected-filter' : ''}`}
            onClick={onClick}
        >
            {!genreSelected && <h3>SELECT A GENRE</h3>}
            {genreSelected && <h3>{selectedGenre.genre}</h3>}
            {genreSelected && <p
                className="edit"
                tabIndex="0"
                onKeyDown={handleKeyDown}
                >
                  Edit
                </p>
            }
        </div>
    );
}

export default GenreSelectionIndicator;

