import { forwardRef, useContext } from "react";
import ConcertsContext from "../context/ConcertsContext.js";

const VenueShow = forwardRef(({ venue, onClick, onKeyDown, isHovered, isActive }, ref) =>{

    const { setHoveredVenueId, mapContainer } = useContext(ConcertsContext);

    const handleVenueMouseEnter = (mapContainer) => {
        setHoveredVenueId(venue.properties.id);
        const matchingMarker = mapContainer.querySelector(`[data-id='${venue.properties.id.toString()}']`);
        matchingMarker.classList.remove('marker');
        matchingMarker.classList.add('y-marker');
    }

    const handleVenueMouseLeave = (mapContainer) => {
        setHoveredVenueId(null);
        const matchingMarker = mapContainer.querySelector(`[data-id='${venue.properties.id.toString()}']`);
        matchingMarker.classList.remove('y-marker');
        matchingMarker.classList.add('marker');
    }

    return (
      <div
          id={`venue-${venue.properties.id}`}
          role="option"
          aria-selected={isHovered || isActive}
          className={`venue ${isHovered ? "venue-hover" : ""}`}
          ref={ref}
          onClick={onClick}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          onMouseEnter={() => handleVenueMouseEnter(mapContainer)}
          onMouseLeave={() => handleVenueMouseLeave(mapContainer)}
      >
          {venue.properties.name}
      </div>
    )});


export default VenueShow;