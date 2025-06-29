function DropdownOptions({ options }) {
    return (
        <div className='custom-options select-items'>
            {options.map((year) => (
                <div
                    key={year}
                >
                    {year}
                </div>
            ))}
        </div>
    );
}

export default DropdownOptions;