import {FloatLabel} from "primereact/floatlabel";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import type {ReactElement} from "react";

interface YearPickerProps {
    years: number[];
    selectedYear: number | undefined;
    setYear: (year: number) => void;
}

export function YearPicker({years, selectedYear, setYear}: YearPickerProps): ReactElement {
    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="year-picker"
                          variant="filled"
                          onChange={(e: DropdownChangeEvent): void => setYear(e.target.value)}
                          value={selectedYear}
                          options={years}
                          optionLabel="year"
                          placeholder="Select year"/>
                <label htmlFor="year-picker">Year</label>
            </FloatLabel>
        </div>
    )
}