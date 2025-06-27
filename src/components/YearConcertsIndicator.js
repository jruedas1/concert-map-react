function YearVenuesIndicator({year, venue}) {
    return (
        <div id="concert-to-venue-breadcrumb-flex-parent">
            <h2>{year}</h2>
            <p>{venue.name}</p>
        </div>
    );
}

export default YearVenuesIndicator;