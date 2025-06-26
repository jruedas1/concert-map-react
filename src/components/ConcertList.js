import ConcertShow from "./ConcertShow.js";

function ConcertList({venue}) {
    console.log(venue)

    const renderedConcerts = venue.concerts.map((concert) => {
        return <ConcertShow concert={concert} key={concert.id} />;
    });
    return (
        <div id="concerts" className="overflow-scroll">{renderedConcerts}</div>
    )
}

export default ConcertList;