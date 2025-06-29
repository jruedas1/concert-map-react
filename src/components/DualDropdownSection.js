import '../css/DualDropdownSection.css';
import Dropdown from "./Dropdown";

const createYearOptions = (start, end) => {
    const yearOptions = [];
    for (let i = start; i <= end; i++){
        yearOptions.push(i);
    }
    return yearOptions;
}

const startOptions=createYearOptions(1970, 2005);
const endOptions=createYearOptions(1970, 2009);

function DualDropdownSection(){
    return (
        <div id="custom-selector-wrapper">
           <Dropdown id="custom-start-range-selector" options={startOptions} />
           <div id="range-selection-state">to</div>
           <Dropdown options={endOptions} />
        </div>
    );
}

export default DualDropdownSection;