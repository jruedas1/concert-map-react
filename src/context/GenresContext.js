import { createContext, useState } from "react";

const GenresContext = createContext();

function Provider({ children }){
    const [startYear, setStartYear] = useState(1970);
    const [endYear, setEndYear] = useState(1970);
    const [selectedGenre, setSelectedGenre] = useState(null);

    const genres = {
        startYear,
        setStartYear,
        endYear,
        setEndYear,
        selectedGenre,
        setSelectedGenre
    }

    return (
        <GenresContext.Provider value={genres}>
            {children}
        </GenresContext.Provider>
    );
}

export { Provider };
export default GenresContext;