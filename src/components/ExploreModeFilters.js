import DateRangeSelectionIndicator from "./DateRangeSelectionIndicator.js";
import DualDropdownSection from "./DualDropdownSection.js";
import SelectGenreButton from "./SelectGenreButton.js";

function ExploreModeFilters(){
    return (
        <section>
            <DateRangeSelectionIndicator />
            <DualDropdownSection />
            <SelectGenreButton />
        </section>
    );
}

export default ExploreModeFilters;