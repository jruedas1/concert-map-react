import DropdownOptions from "./DropdownOptions.js";

function Dropdown ({ options }) {
    console.log(options);
    return (
      <div className="selected-and-options-flex-wrapper">
          <div  className="custom-selector select-selected"
                tabIndex={0}
          >
              1970
          </div>
          <div className='custom-select-option-wrapper'>
            <DropdownOptions options={options} />
          </div>
      </div>
    );
}

export default Dropdown;