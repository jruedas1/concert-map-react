import '../css/InteractionModeSelector.css';

function InteractionModeSelector({ onModeSelect, interactionMode }){

    const handleKeyDown = (e, mode) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onModeSelect(mode);
        }
    };

    return (
        <div id="interaction-mode-selector" className='filter'>
            <h3 className={`search-type-selector search-mode-selector ${interactionMode==='search' ? 'selected' : ''}`}
                tabIndex={0}
                onClick={()=> onModeSelect('search')}
                onKeyDown={(e) => handleKeyDown(e, 'search')}
                role="button"
                aria-pressed={interactionMode === 'search'}
            >
                SEARCH
            </h3>
            <h3 className={`search-type-selector explore-mode-selector ${interactionMode==='explore' ? 'selected' : ''}`}
                tabIndex={0}
                onClick={()=> onModeSelect('explore')}
                onKeyDown={(e) => handleKeyDown(e, 'explore')}
                role="button"
                aria-pressed={interactionMode === 'explore'}
            >
                EXPLORE
            </h3>
        </div>
    );
}

export default InteractionModeSelector;