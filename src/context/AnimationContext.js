import {createContext, useEffect, useState} from "react";
import {getVenue} from "../services/dataAccess.js";

const AnimationContext = createContext();

function Provider({children}){
    const [genreConcerts, setGenreConcerts] = useState([]);
    const [genreConcertIndex, setGenreConcertIndex] = useState(-1);
    const [uniqueVenues, setUniqueVenues] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const stopAnimation = () => {
        setIsAnimating(false);
    };

    const startAnimation = () => {
        setGenreConcertIndex(0);
        setIsAnimating(true);
    };

    const animation = {
        genreConcerts,
        setGenreConcerts,
        genreConcertIndex,
        setGenreConcertIndex,
        stopAnimation,
        uniqueVenues
    }

    // this works but it's clunky and slow compared to having all the data
    // stored in genres all at once
    useEffect(() => {
       const getUniqueVenues = async () => {
           const uniqueVenueIds = [... new Set(genreConcerts.map(concert => concert['venue_id']))];
           const uniqueVenues = await Promise.all(uniqueVenueIds.map(venueId => getVenue(venueId)));
           const uniqueVenueMap = uniqueVenues.reduce((acc, venue) => {
               acc[venue.id] = venue;
               return acc;
           }, {});
           console.log(uniqueVenueMap);
           setUniqueVenues(uniqueVenueMap);
       }
       getUniqueVenues();
    }, [genreConcerts]);

    useEffect(()=>{
        console.log(uniqueVenues);
        if (uniqueVenues && genreConcerts?.length > 0) {
            startAnimation();
        }
    }, [uniqueVenues]);

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