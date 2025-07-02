import {createContext, useEffect, useState} from "react";
import {getVenue} from "../services/dataAccess.js";

const AnimationContext = createContext();

function Provider({children}){
    const [genreConcerts, setGenreConcerts] = useState([]);
    const [genreConcertIndex, setGenreConcertIndex] = useState(-1);
    const [isAnimating, setIsAnimating] = useState(false);

    const stopAnimation = () => {
        setIsAnimating(false);
    };

    const animation = {
        genreConcerts,
        setGenreConcerts,
        genreConcertIndex,
        setGenreConcertIndex,
        stopAnimation
    }

    useEffect(()=>{
        if (genreConcerts?.length > 0) {

            setGenreConcertIndex(-1);
            setIsAnimating(true);
        }
    }, [genreConcerts]);

    useEffect(() => {
        if (!isAnimating) return;

        if (genreConcertIndex >= genreConcerts.length - 1) {
            console.log("animation finished");
            setIsAnimating(false);
            return;
        }

        const delay = setTimeout(() => {
            setGenreConcertIndex(prev => prev+1);
        }, 300);
        return ()=> clearTimeout(delay);
    }, [genreConcertIndex, isAnimating]);

    return (
        <AnimationContext.Provider value={animation}>
            {children}
        </AnimationContext.Provider>
    );
}

export { Provider }
export default AnimationContext;