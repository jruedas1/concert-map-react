import VenueShow from "./VenueShow.js";
import { useRef, useEffect } from "react";

function VenueList({ venues, onVenueClick }){
    const containerRef = useRef(null);
    const venueRefs = useRef([]);

    useEffect(() => {
        venueRefs.current = venueRefs.current.slice(0, venues.length);
    }, [venues]);

    const handleListKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            venueRefs.current[0]?.focus();
        }
    };

    const handleVenueKeyDown = (e, index) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            venueRefs.current[index + 1]?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            venueRefs.current[index - 1]?.focus();
        } else if (e.key === "Enter") {
            e.preventDefault();
            onVenueClick(venues[index]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            containerRef.current?.focus();
        }
    };

    const renderedVenues = venues.map((venue, index) => {
        return <VenueShow
            venue={venue}
            key={venue.id}
            onClick={()=>onVenueClick(venue)}
            onKeyDown={(e) => handleVenueKeyDown(e, index)}
            ref={(el) => (venueRefs.current[index] = el)}
        />
    });

    return (
        <div id="venues"
             className="overflow-scroll"
             tabIndex="0"
             role="listbox"
             aria-label="List of Venues"
             ref={containerRef}
             onKeyDown={handleListKeyDown}
        >
            {renderedVenues}
        </div>
    );
}

export default VenueList;