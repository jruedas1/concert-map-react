function DecadeSelectionIndicator({ decade, onClick }){
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
      <div id='decades'
           className={`filter ${decade ? 'selected-filter' : ''}`}
           tabIndex={0}
           onClick={onClick}
           onKeyDown={handleKeyDown}
      >
          {!decade && <h3>SELECT A DECADE</h3>}
          {decade && <h3>{decade}s</h3>}
          <p className={`edit ${!decade ? 'hidden' : ''}`}>Change Decade</p>
      </div>
    );
}

export default DecadeSelectionIndicator;