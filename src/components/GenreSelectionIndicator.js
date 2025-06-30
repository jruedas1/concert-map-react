function GenreSelectionIndicator({ onClick }) {
    return (
        <div
            id="genres"
            className="filter"
            onClick={onClick}
        >
            <h3>SELECT A GENRE</h3>
            <p className="edit hidden" tabIndex="0">Edit</p>
        </div>
    );
}

export default GenreSelectionIndicator;

