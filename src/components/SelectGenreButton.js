import '../css/SelectGenre.css';

function SelectGenreButton({ onClick }) {
    return (
        <button
            id="confirm-range-selection"
            className="next"
            onClick={onClick}
        >
            SELECT GENRE
        </button>
    );
}

export default SelectGenreButton;