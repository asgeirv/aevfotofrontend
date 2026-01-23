import {FloatLabel} from "primereact/floatlabel";
import {Dropdown} from "primereact/dropdown";
import type {Month} from "../models/Month.ts";

interface MonthPickerProps {
    months: Month[] | undefined;
    selectedMonth: Month | undefined;
    setMonth: (month: Month) => void;
}

export function MonthPicker({months, selectedMonth, setMonth}: MonthPickerProps) {
    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="month-picker"
                          variant="filled"
                          disabled={!months || months.length == 0}
                          onChange={e => setMonth(e.target.value)}
                          value={selectedMonth}
                          options={months}
                          optionLabel={selectedMonth?.num.toString()}
                          placeholder="Select month"/>
                <label htmlFor="month-picker">Month</label>
            </FloatLabel>
        </div>
    )
}