import Button from "./Button";

function ChangeSelectionsPrompt({ onClick, divId }){

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div id={divId}>
            <div tabIndex="0"
                 onClick={onClick}
                 onKeyDown={handleKeyDown}
                 role="button"
                 aria-label="Change Selections"
            >
                <img src="/img/left-pointing-arrow.svg" alt="arrow pointing left"/>
                <p className="edit">Change Selections</p>
            </div>
            <Button secondary rounded>Map View</Button>
        </div>
    );
}

export default ChangeSelectionsPrompt;