import {FloatLabel} from "primereact/floatlabel";
import {Dropdown} from "primereact/dropdown";

interface YearPickerProps {
    years: number[];
    selectedYear: number | undefined;
    setYear: (year: number) => void;
}

export function YearPicker({years, selectedYear, setYear}: YearPickerProps) {
    if (!selectedYear) {
        setYear(years[0]);
    }

    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="year-picker"
                          variant="filled"
                          value={selectedYear}
                          onChange={e => setYear(e.target.value)}
                          options={years}/>
                <label htmlFor="year-picker">Year</label>
            </FloatLabel>
        </div>
    )
}