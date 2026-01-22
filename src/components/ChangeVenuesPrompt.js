function ChangeVenuesPrompt({ onClick }) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };
    return (
        <div id="concert-to-venue-breadcrumb" onClick={onClick} onKeyDown={handleKeyDown}>
            <div id="back-to-venues" tabIndex="0">
                <img src={`${import.meta.env.BASE_URL}img/left-pointing-arrow.svg`} alt="arrow pointing left"/>
                <p>Back to venues</p>
            </div>
        </div>
    );
}

export default ChangeVenuesPrompt;