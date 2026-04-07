import {useState} from "react";
import ConcertShow from "./ConcertShow.js";
import Button from "./Button";
import ShareConcertModal from "./ShareConcertModal";

function ConcertList({ concerts, isAnimating=false }) {
    const [showModal, setShowModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleClick = () => setShowModal(true);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false);
        }, 300);
    }

    const renderedConcerts = concerts.map((concert) => {

        concert = concert.properties ?? concert;

        return <ConcertShow concert={concert} key={concert.id} />;
    });
    return (
        <div id="concerts" className="overflow-scroll">
            {renderedConcerts}
            {!isAnimating && (
            <div className="share-concert">
                <h3>Missing a concert?</h3>
                <Button className='plain' onClick={handleClick}>
                    CONTRIBUTE HERE
                </Button>
                {showModal && <ShareConcertModal onClose={handleClose} isClosing={isClosing}/>}
            </div>
            )}
        </div>
    )
}

export default ConcertList;