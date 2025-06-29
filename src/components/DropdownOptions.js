function DropdownOptions({ options, selectedYear, onClick }) {
    return (
        <div className='custom-options select-items'>
            {options.map((year) => (
                <div
                    key={year}
                    className={year === selectedYear ? "same-as-selected" : ""}
                    onClick={() => onClick(year)}
                >
                    {year}
                </div>
            ))}
        </div>
    );
}

export default DropdownOptions;