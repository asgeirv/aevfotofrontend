import {FloatLabel} from "primereact/floatlabel";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import {type ReactElement, useEffect, useState} from "react";
import {apiClient} from "../utils/apiClient.tsx";
import {type NavData, useNavContext} from "../context/NavContext.tsx";
import {useToast} from "../context/ToastContext.tsx";
import {MessageSeverity} from "primereact/api";
import type {Month} from "../models/Photo.ts";

export function MonthPicker(): ReactElement {
    const [months, setMonths] = useState<Month[]>([]);

    const navData: NavData = useNavContext();
    const showToast: ((severity: MessageSeverity, message: string) => void) | undefined = useToast();

    useEffect((): void => {
        if (navData?.year) {
            apiClient(`${navData.year}`)
                .then((res: Response): Promise<Month[]> => res.json())
                .then((data: Month[]): void => setMonths(data))
                .catch((err: Error): void => {
                    showToast(MessageSeverity.ERROR, `Error getting months for $${navData.year}`);
                    console.error(err);
                });
        }
    }, [navData.year, showToast]);

    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="month-picker"
                          variant="filled"
                          disabled={!months || months.length == 0}
                          onChange={(e: DropdownChangeEvent): void => navData.setMonth(e.target.value)}
                          value={navData.month}
                          options={months}
                          optionLabel="num"
                          placeholder="Select month"/>
                <label htmlFor="month-picker">Month</label>
            </FloatLabel>
        </div>
    )
}