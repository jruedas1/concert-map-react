function VenueShow({ venue, onClick }){
    return (
      <div onClick={onClick} tabIndex={-1}>
          {venue.name}
      </div>
    );
}

export default VenueShow;