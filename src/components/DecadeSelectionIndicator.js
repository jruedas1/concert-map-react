function DecadeSelectionIndicator({ decade, onClick }){
    return (
      <div id='decades' className='filter' tabIndex={0} onClick={onClick}>
          {!decade && <h3>SELECT A DECADE</h3>}
          {decade && <h3>{decade}s</h3>}
          <p className={`edit ${!decade ? 'hidden' : ''}`} tabIndex={0}>Change Decade</p>
      </div>
    );
}

export default DecadeSelectionIndicator;