function ChangeVenuesPrompt({ onClick }) {
    return (
        <div id="concert-to-venue-breadcrumb" onClick={onClick}>
            <div id="back-to-venues" tabIndex="0">
                <img src="/img/left-pointing-arrow.svg" alt="arrow pointing left"/>
                <p>Back to venues</p>
            </div>
        </div>
    );
}

export default ChangeVenuesPrompt;