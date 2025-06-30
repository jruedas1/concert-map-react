import {useState, useContext, useEffect} from "react";
import GenresContext from "../context/GenresContext.js";
import { fetchGenreData } from "../services/dataAccess.js";
import DateRangeSelectionIndicator from "./DateRangeSelectionIndicator.js";
import DualDropdownSection from "./DualDropdownSection.js";
import SelectGenreButton from "./SelectGenreButton.js";
import GenreSelectionIndicator from "./GenreSelectionIndicator.js";
import GenreList from "./GenreList.js";

function ExploreModeFilters(){



    const [genres, setGenres] = useState([]);
    const [rangeSelected, setRangeSelected] = useState(false);
    const [showRangeSelection, setShowRangeSelection] = useState(true);
    const [showGenreSelection, setShowGenreSelection] = useState(false);
    const [showGenreList, setShowGenreList] = useState(false);
    const { startYear, endYear } = useContext(GenresContext);

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

    const handleToggleGenreList = () => {
        setShowGenreList(prev => !prev);
    }

    return (
        <section>
            <DateRangeSelectionIndicator
               rangeSelected={rangeSelected}
               startYear={startYear}
               endYear={endYear}
            />
            {showRangeSelection && <DualDropdownSection />}
            {showRangeSelection && <SelectGenreButton  onClick={handleClickSelectGenre} />}
            {showGenreSelection && <GenreSelectionIndicator onClick={handleToggleGenreList}/>}
            {showGenreList && <GenreList genres={genres} />}
        </section>
    );
}

export default ExploreModeFilters;