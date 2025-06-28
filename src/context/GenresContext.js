import { createContext, useState } from "react";

const GenresContext = createContext();

function Provider({ children }){


    const genres = {

    }

    return (
        <GenresContext.Provider value={genres}>
            {children}
        </GenresContext.Provider>
    );
}

export { Provider };
export default GenresContext;