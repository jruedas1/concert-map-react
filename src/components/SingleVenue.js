import '../css/SingleVenue.css';

function SingleVenue({ venue, onClick }){
    console.log(venue)
    return (
        <div
            className="single-venue"
            onClick={onClick}
        >
            <h3>{venue.properties.name}</h3>
            <p>
                {venue.address}
                <br/>
                {venue.city}, {venue.state} {venue.zip}
            </p>
        </div>
    );
}

export default SingleVenue;