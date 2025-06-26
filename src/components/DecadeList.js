import FilterOption from './FilterOption.js';

function DecadeList({ onDecadeSelect }){
    const decades = [
        { id: 1970, label: '1970s' },
        { id: 1980, label: '1980s' },
        { id: 1990, label: '1990s' },
        { id: 2000, label: '2000s' },
    ];

    const handleDecadeClick = (decade) => {
        onDecadeSelect(decade);
        return decade;
    }

    return (
        <div id="decade-list">
            {decades.map(({ id, label }) => (
                <FilterOption key={id} id={id} label={label} onClick={handleDecadeClick}/>
            ))}
        </div>)
}

export default DecadeList;