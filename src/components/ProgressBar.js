import { useContext } from "react";
import "../css/ProgressBar.css";
import AnimationContext from "../context/AnimationContext";

function ProgressBar(){
    const { progress } = useContext(AnimationContext);
    return (
        <div id="progress-bar">
            <div  id="progress" className="progress" style={{ width: `${progress}%` }}></div>
        </div>
    );
}

export default ProgressBar;

