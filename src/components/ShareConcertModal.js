import '../css/ShareConcertModal.css'
import ReactDOM from "react-dom";
import Button from "./Button";

function ShareConcertModal({ onClose, isClosing }){
    return ReactDOM.createPortal(
        <div className={`shareConcertModalWrapper ${isClosing ? 'closing' : ''}`}
             onClick={onClose}
        >
            <div id="shareConcertModalContent">
                <div id="shareConcertModalTitle">
                    <h3>ADD A MISSING CONCERT</h3>
                    <button>
                    </button>
                </div>
                <div className='modalBody'>
                    <iframe
                        src="https://cedish.utsa.edu/sounds/webform/add_a_missing_concert/share/iframe-resizer/4.2.10"
                        title="Add a Missing Concert"
                        className="webform-share-iframe"
                        allow="geolocation; microphone; camera"
                    />
                </div>
                <div id="shareConcertModalClose">
                    <Button primary rounded onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>

        </div>,
        document.querySelector('.modal-container')
    );
}

export default ShareConcertModal;