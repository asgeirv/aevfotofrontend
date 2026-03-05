import {FloatLabel} from "primereact/floatlabel";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import type {ReactElement} from "react";

interface MonthPickerProps {
    months: number[] | undefined;
    selectedMonth: number | undefined;
    setMonth: (month: number) => void;
}

export function MonthPicker({months, selectedMonth, setMonth}: MonthPickerProps): ReactElement {
    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="month-picker"
                          variant="filled"
                          disabled={!months || months.length == 0}
                          onChange={(e: DropdownChangeEvent): void => setMonth(e.target.value)}
                          value={selectedMonth}
                          options={months}
                          optionLabel="num"
                          placeholder="Select month"/>
                <label htmlFor="month-picker">Month</label>
            </FloatLabel>
        </div>
    )
}