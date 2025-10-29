import Button from "./Button";
import {useContext} from "react";
import ViewportContext from "../context/ViewportContext";

function ChangeSelectionsPrompt({ onClick, divId }){
    const { isMobile, view, setView } = useContext(ViewportContext);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    const handleListMapButtonClick = () => {
        setView(prev => (prev === "map" ? "list" : "map"));
    }

    return (
        <div id={divId}>
            <div tabIndex="0"
                 onClick={onClick}
                 onKeyDown={handleKeyDown}
                 role="button"
                 aria-label="Change Selections"
            >
                <img src="img/left-pointing-arrow.svg" alt="arrow pointing left"/>
                <p className="edit">Change Selections</p>
            </div>
            {isMobile && <Button secondary rounded onClick={handleListMapButtonClick}>
                {view === "map" ? "List View" : "Map View"}
            </Button>}
        </div>
    );
}

export default ChangeSelectionsPrompt;