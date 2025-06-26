import '../css/InteractionModeSelector.css';

function InteractionModeSelector({ onModeSelect, interactionMode }){
    return (
        <div id="interaction-mode-selector" className='filter'>
            <h3 className={`search-type-selector search-mode-selector ${interactionMode==='search' ? 'selected' : ''}`}
                tabIndex={0}
                onClick={()=> onModeSelect('search')}
            >
                SEARCH
            </h3>
            <h3 className={`search-type-selector explore-mode-selector ${interactionMode==='explore' ? 'selected' : ''}`}
                tabIndex={0}
                onClick={()=> onModeSelect('explore')}
            >
                EXPLORE
            </h3>
        </div>
    );
}

export default InteractionModeSelector;