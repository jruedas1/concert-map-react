import { useState, useEffect, useContext } from "react";
import GenresContext from "../context/GenresContext.js";
import AnimationContext from "../context/AnimationContext.js";
import { fetchGenreData, fetchGenreConcertsInYearRange } from "../services/dataAccess.js";
import DateRangeSelectionIndicator from "./DateRangeSelectionIndicator.js";
import DualDropdownSection from "./DualDropdownSection.js";
import GenreSelectionIndicator from "./GenreSelectionIndicator.js";
import GenreList from "./GenreList.js";
import Button from "./Button";

function ExploreSelectGenrePanel({ resetTrigger }) {
    const [genres, setGenres] = useState([]);
    const [rangeSelected, setRangeSelected] = useState(false);
    const [showRangeSelection, setShowRangeSelection] = useState(true);
    const [showGenreSelection, setShowGenreSelection] = useState(false);
    const [showGenreList, setShowGenreList] = useState(false);
    const [genreSelected, setGenreSelected] = useState(false);
    const [showShowResultsButton, setShowShowResultsButton] = useState(false);

    const { startYear, endYear, selectedGenre, setSelectedGenre } = useContext(GenresContext);
    const { setGenreConcerts, setIsAnimating } = useContext(AnimationContext);

    useEffect(() => {
        const getGenres = async () => {
            const currentGenres = await fetchGenreData();
            setGenres(currentGenres);
        };
        getGenres();
    }, []);

    const handleClickSelectGenre = () => {
        setRangeSelected(true);
        setShowRangeSelection(false);
        setShowGenreSelection(true);
        setShowGenreList(true);
    };

    const handleToggleRangeSelection = () => {
        setShowRangeSelection(prev => !prev);
        setShowGenreSelection(false);
        setShowGenreList(false);
        setShowShowResultsButton(false);
        setRangeSelected(false);
    };

    const handleToggleGenreList = () => {
        setShowGenreList(prev => !prev);
    };

    function capitalizeWords(str) {
        return str.replace(/(^|[^a-zA-Z0-9])([a-z])/g, (match, sep, char) => sep + char.toUpperCase());
    }

    const handleGenreClick = (genre, id) => {
        const capGenre = capitalizeWords(genre);
        setSelectedGenre({
            genre: capGenre,
            id,
        });
        setGenreSelected(true);
        setShowGenreList(false);
        setShowShowResultsButton(true);
    };

    const handleGetGenreResults = async () => {
        const genreRangeData = await fetchGenreConcertsInYearRange(selectedGenre.id, startYear, endYear);
        setGenreConcerts(genreRangeData);
    };

    useEffect(() => {
        setRangeSelected(false);
        setShowRangeSelection(true);
        setShowGenreSelection(false);
        setShowGenreList(false);
        setGenreSelected(false);
        setShowShowResultsButton(false);
    }, [resetTrigger]);

    return (
        <section>
            <DateRangeSelectionIndicator
                rangeSelected={rangeSelected}
                startYear={startYear}
                endYear={endYear}
                onClick={handleToggleRangeSelection}
            />
            {showRangeSelection && <DualDropdownSection />}
            {showRangeSelection && <Button
                onClick={handleClickSelectGenre}
                className='next'
            >
                SELECT GENRE
            </Button>}
            {showGenreSelection && (
                <GenreSelectionIndicator
                    onClick={handleToggleGenreList}
                    genreSelected={genreSelected}
                    selectedGenre={selectedGenre}
                />
            )}
            {showGenreList && (
                <GenreList
                    genres={genres}
                    handleGenreClick={handleGenreClick}
                    selectedGenre={selectedGenre}
                />
            )}
            {showShowResultsButton && (
                <div id="confirm-genre-parent"
                     className="confirm">
                    <Button primary
                            className='next'
                            onClick={handleGetGenreResults}
                    >
                        SHOW MY RESULTS
                    </Button>
                </div>
            )}
        </section>
    );
}

export default ExploreSelectGenrePanel;
