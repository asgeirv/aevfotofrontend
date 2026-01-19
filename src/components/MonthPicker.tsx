import {FloatLabel} from "primereact/floatlabel";
import {Dropdown} from "primereact/dropdown";

interface MonthPickerProps {
    months: string[];
    selectedMonth: string | undefined;
    setMonth: (month: string) => void;
}

export function MonthPicker({months, selectedMonth, setMonth}: MonthPickerProps) {
    const options: string[] = months ? months : [];
    const disabled: boolean = options.length === 0;

    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="month-picker"
                          variant="filled"
                          disabled={disabled}
                          value={selectedMonth}
                          onChange={e => setMonth(e.target.value)}
                          options={months}
                          placeholder={selectedMonth}/>
                <label htmlFor="month-picker">Month</label>
            </FloatLabel>
        </div>
    )
}