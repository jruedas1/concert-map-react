import ReactDOM from "react-dom";
import '../css/Modal.css'

function Modal({ onClose, onExploreClick }){
    return ReactDOM.createPortal (
        <div>
            <div id="modalWrapper" onClick={onClose}>
                <div id="modalContent">
                    <h2>The Sounds of San Anto Map highlights a sample of concerts both large and small between 1970 and
                        2010. Don't miss a beat, check out the map in two different ways!</h2>
                    <div id="modalOptionDescriptions">
                        <div>
                            <p>Choose a year and music venue to find out who plugged in.</p>
                            <button>START SEARCHING</button>
                        </div>
                        <div>
                            <p>Recreate a timeline of your favorite musical genres.</p>
                            <button className="explore-mode-selector" onClick={onExploreClick}>START EXPLORING</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector('.modal-container')
    );
}

export default Modal;