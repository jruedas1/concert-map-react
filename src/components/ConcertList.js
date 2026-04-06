import ConcertShow from "./ConcertShow.js";
import Button from "./Button";

function ConcertList({concerts}) {

    const renderedConcerts = concerts.map((concert) => {

        concert = concert.properties ?? concert;

        return <ConcertShow concert={concert} key={concert.id} />;
    });
    return (
        <div id="concerts" className="overflow-scroll">
            {renderedConcerts}
            <div className="share-concert">
                <h3>Missing a concert?</h3>
                <a>
                    CONTRIBUTE HERE
                </a>
            </div>
        </div>
    )
}

export default ConcertList;