import { forwardRef } from "react";

const VenueShow = forwardRef(({ venue, onClick, onKeyDown }, ref) =>{

    return (
      <div
          role="option"
          className='venue'
          ref={ref}
          onClick={onClick}
          tabIndex={-1}
          onKeyDown={onKeyDown}
      >
          {venue.name}
      </div>
    )});


export default VenueShow;