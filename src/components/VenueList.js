import VenueShow from "./VenueShow.js";
import { useRef, useEffect, useContext } from "react";
import ConcertsContext from "../context/ConcertsContext.js";

function VenueList({ venues, onVenueClick }){

    const { setHoveredMarkerVenueId, hoveredVenueId, hoveredMarkerVenueId } = useContext(ConcertsContext);

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

    const sortedVenues = [...venues];

    if (hoveredMarkerVenueId) {
        const index = sortedVenues.findIndex(v => v.id === hoveredMarkerVenueId);
        if (index > -1) {
            const [hoveredVenue] = sortedVenues.splice(index, 1);
            sortedVenues.unshift(hoveredVenue);
        }
    }

    const renderedVenues = sortedVenues.map((venue, index) => {
        return <VenueShow
            venue={venue}
            key={venue.id}
            onClick={()=>onVenueClick(venue)}
            onKeyDown={(e) => handleVenueKeyDown(e, index)}
            ref={(el) => (venueRefs.current[index] = el)}
            isHovered={hoveredVenueId === venue.id || hoveredMarkerVenueId === venue.id}
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