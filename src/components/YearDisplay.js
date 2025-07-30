import { useContext } from "react";
import AnimationContext from "../context/AnimationContext";
import '../css/YearDisplay.css';

function YearDisplay(){
    const { currentYear } = useContext(AnimationContext);

    return (
        <div id="animation-year-output">
            <h2>{currentYear}</h2>
        </div>
    );
}

export default YearDisplay;