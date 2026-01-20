import ConcertShow from "./ConcertShow.js";

function ConcertList({concerts}) {

    const renderedConcerts = concerts.map((concert) => {

        concert = concert.properties ?? concert;

        return <ConcertShow concert={concert} key={concert.id} />;
    });
    return (
        <div id="concerts" className="overflow-scroll">{renderedConcerts}</div>
    )
}

export default ConcertList;