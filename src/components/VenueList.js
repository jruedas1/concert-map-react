import VenueShow from "./VenueShow.js";
import { useRef, useEffect, useContext, useState } from "react";
import ConcertsContext from "../context/ConcertsContext.js";
import ViewportContext from "../context/ViewportContext";
import map from "./Map";

function VenueList({ venues, onVenueClick }){

    const { setHoveredMarkerVenueId, hoveredVenueId, hoveredMarkerVenueId } = useContext(ConcertsContext);
    const { isMobile, view } = useContext(ViewportContext);

    const [activeIndex, setActiveIndex] = useState(0);

    const containerRef = useRef(null);
    const venueRefs = useRef([]);

    const sortedVenues = [...venues];

    useEffect(() => {
        venueRefs.current = venueRefs.current.slice(0, venues.length);
    }, [sortedVenues]);


    if (hoveredMarkerVenueId) {
        const index = sortedVenues.findIndex(v => v.id === hoveredMarkerVenueId);
        if (index > -1) {
            const [hoveredVenue] = sortedVenues.splice(index, 1);
            sortedVenues.unshift(hoveredVenue);
        }
    }

    const handleListKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            venueRefs.current[0]?.focus();
        }
    };

    const handleVenueKeyDown = (e, index) => {
        e.stopPropagation();
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = Math.min(index + 1, sortedVenues.length - 1);
            venueRefs.current[next]?.focus();
            setActiveIndex(next);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const next = Math.max(index - 1, 0);
            venueRefs.current[next]?.focus();
            setActiveIndex(next);
        } else if (e.key === "Enter") {
            e.preventDefault();
            onVenueClick(sortedVenues[index]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            containerRef.current?.focus();
        } else if (e.key === "Home") {
            e.preventDefault();
            venueRefs.current[0]?.focus();
            setActiveIndex(0);
        } else if (e.key === "End") {
            e.preventDefault();
            const last = sortedVenues.length - 1;
            venueRefs.current[last]?.focus();
            setActiveIndex(last);
        }
    };

    const renderedVenues = sortedVenues.map((venue, index) => {
        return <VenueShow
            venue={venue}
            key={venue.id}
            onClick={()=>onVenueClick(venue)}
            onKeyDown={(e) => handleVenueKeyDown(e, index)}
            ref={(el) => (venueRefs.current[index] = el)}
            isHovered={hoveredVenueId === venue.id || hoveredMarkerVenueId === venue.id}
            isActive={activeIndex === index}
        />
    });

    const mapView = view === "map";

    return (
        <div id="venues"
             className={
                    `${mapView && isMobile ? "mobile-hidden" : ""}
                    overflow-scroll
                `}
             tabIndex="0"
             role="listbox"
             aria-label="List of Venues"
             ref={containerRef}
             onKeyDown={handleListKeyDown}
             aria-activedescendant={`venue-${sortedVenues[activeIndex]?.id}`}
        >
            {renderedVenues}
        </div>
    );
}

export default VenueList;