import '../css/ShareConcertModal.css'
import ReactDOM from "react-dom";

function ShareConcertModal({ onClose }){
    return ReactDOM.createPortal(
        <div className='shareConcertModalWrapper' onClick={onClose} >
            <div id="shareConcertModalContent">
                <div id="shareConcertModalTitle">
                    <h3>ADD A MISSING CONCERT</h3>
                </div>
                <div className='modalBody'>
                    <iframe
                        src="https://cedish.utsa.edu/sounds/webform/add_a_missing_concert/share/iframe-resizer/4.2.10"
                        title="Add a Missing Concert"
                        className="webform-share-iframe"
                        // style={{ width: "1px", minWidth: "100%" }}
                        allow="geolocation; microphone; camera"
                    />
                </div>
            </div>

        </div>,
        document.querySelector('.modal-container')
    );
}

export default ShareConcertModal;