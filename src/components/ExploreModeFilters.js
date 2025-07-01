import {useState, useContext, useEffect} from "react";
import GenresContext from "../context/GenresContext.js";
import AnimationContext from "../context/AnimationContext.js";
import {fetchGenreConcertsInYearRange, fetchGenreData} from "../services/dataAccess.js";
import DateRangeSelectionIndicator from "./DateRangeSelectionIndicator.js";
import DualDropdownSection from "./DualDropdownSection.js";
import SelectGenreButton from "./SelectGenreButton.js";
import GenreSelectionIndicator from "./GenreSelectionIndicator.js";
import GenreList from "./GenreList.js";
import ShowGenreResultsButton from "./ShowGenreResultsButton.js";

function ExploreModeFilters(){



    const [genres, setGenres] = useState([]);
    const [rangeSelected, setRangeSelected] = useState(false);
    const [showRangeSelection, setShowRangeSelection] = useState(true);
    const [showGenreSelection, setShowGenreSelection] = useState(false);
    const [showGenreList, setShowGenreList] = useState(false);
    const [genreSelected, setGenreSelected] = useState(false);
    const [showShowResultsButton, setShowShowResultsButton] = useState(false);
    const { startYear,
            endYear,
            selectedGenre,
            setSelectedGenre,
          } = useContext(GenresContext);
    const { setGenreConcerts } = useContext(AnimationContext);

    useEffect(() => {
        const getGenres = async() => {
            const currentGenres = await fetchGenreData();
            setGenres(currentGenres);
        }
        getGenres();
    }, [])

    const handleClickSelectGenre = () => {
        setRangeSelected(true);
        setShowRangeSelection(false);
        setShowGenreSelection(true);
        setShowGenreList(true);
    }

    const handleToggleRangeSelection = () => {
        setShowRangeSelection(prev => !prev);
        setShowGenreSelection(false);
        setShowGenreList(false);
        setShowShowResultsButton(false);
        setRangeSelected(false);
    }

    const handleToggleGenreList = () => {
        setShowGenreList(prev => !prev);
    }

    function capitalizeWords(str) {
        return str.replace(/(^|[^a-zA-Z0-9])([a-z])/g, (match, sep, char) => {
            return sep + char.toUpperCase();
        });
    }

    const handleGenreClick = (genre, id)=> {
        const capGenre = capitalizeWords(genre);
        setSelectedGenre({
            genre: capGenre,
            id
        });
        setGenreSelected(true);
        setShowGenreList(false);
        setShowShowResultsButton(true);
    }

    const handleGetGenreResults = async (startYear, endYear, genre) => {
        const genreRangeData = await fetchGenreConcertsInYearRange(genre.id, startYear, endYear);
        console.log(genreRangeData);
        setGenreConcerts(genreRangeData);
    }

    return (
        <section>
            <DateRangeSelectionIndicator
               rangeSelected={rangeSelected}
               startYear={startYear}
               endYear={endYear}
               onClick={handleToggleRangeSelection}
            />
            {showRangeSelection && <DualDropdownSection />}
            {showRangeSelection && <SelectGenreButton  onClick={handleClickSelectGenre} />}
            {showGenreSelection && <GenreSelectionIndicator
                                        onClick={handleToggleGenreList}
                                        genreSelected={genreSelected}
                                        selectedGenre={selectedGenre}
                                   />}
            {showGenreList && <GenreList
                                genres={genres}
                                handleGenreClick={handleGenreClick}
                              />}
            {showShowResultsButton && <ShowGenreResultsButton
                                        startYear={startYear}
                                        endYear={endYear}
                                        genre={selectedGenre}
                                        onClick={handleGetGenreResults}
                                      />}

        </section>
    );
}

export default ExploreModeFilters;