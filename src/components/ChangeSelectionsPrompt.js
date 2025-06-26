function ChangeSelectionsPrompt({ onClick }){
    return (
        <div id="back-to-year-edit-div">
            <div onClick={onClick}>
                <img src="/img/left-pointing-arrow.svg" alt="arrow pointing left"/>
                <p className="edit" tabIndex="0">Change Selections</p>
            </div>
        </div>
    );
}

export default ChangeSelectionsPrompt;