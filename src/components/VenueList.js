import VenueShow from "./VenueShow.js";

function VenueList({ venues, onVenueClick }){

    const renderedVenues = venues.map((venue) => {
        return <VenueShow venue={venue} key={venue.id} onClick={()=>onVenueClick(venue)} />
    });

    return (
        <div id="venues"
             className="overflow-scroll"
             tabIndex="0"
             role="listbox"
             aria-label="List of Venues"
        >
            {renderedVenues}
        </div>
    );
}

export default VenueList;