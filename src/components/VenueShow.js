import { forwardRef, useContext } from "react";
import ConcertsContext from "../context/ConcertsContext.js";

const VenueShow = forwardRef(({ venue, onClick, onKeyDown, isHovered }, ref) =>{

    const { setHoveredVenueId } = useContext(ConcertsContext);

    return (
      <div
          role="option"
          className={`venue ${isHovered ? "venue-hover" : ""}`}
          ref={ref}
          onClick={onClick}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setHoveredVenueId(venue.id)}
          onMouseLeave={() => setHoveredVenueId(null)}
      >
          {venue.name}
      </div>
    )});


export default VenueShow;