import { createContext, useState } from "react";

const AnimationContext = createContext();

function Provider({children}){
    const [genreConcerts, setGenreConcerts] = useState([]);

    const animation = {
        genreConcerts,
        setGenreConcerts
    }

    return (
        <AnimationContext.Provider value={animation}>
            {children}
        </AnimationContext.Provider>
    );
}

export { Provider }
export default AnimationContext;