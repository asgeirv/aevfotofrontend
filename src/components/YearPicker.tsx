import {FloatLabel} from "primereact/floatlabel";
import {Dropdown} from "primereact/dropdown";

interface YearPickerProps {
    years: number[];
    selectedYear: number | undefined;
    setYear: (year: number) => void;
}

export function YearPicker({years, selectedYear, setYear}: YearPickerProps) {
    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="year-picker"
                          variant="filled"
                          onChange={e => setYear(e.target.value)}
                          value={selectedYear}
                          options={years}
                          optionLabel="year"
                          placeholder="Select year"/>
                <label htmlFor="year-picker">Year</label>
            </FloatLabel>
        </div>
    )
}