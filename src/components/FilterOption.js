const FilterOption = ({ label, id, onClick }) => (
    <div className="decade filter-option" data-id={id} tabIndex={-1} onClick={() => onClick(id)}>
        <h3 data-id={id}>{label}</h3>
    </div>
);

export default FilterOption;