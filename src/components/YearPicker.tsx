import {FloatLabel} from "primereact/floatlabel";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import {type ReactElement, useEffect, useEffectEvent, useState} from "react";
import {apiClient} from "../utils/apiClient.tsx";
import {type ToastStuff, useToast} from "../context/ToastContext.tsx";
import {type NavData, useNavContext} from "../context/NavContext.tsx";
import {MessageSeverity} from "primereact/api";

export function YearPicker(): ReactElement {
    const [years, setYears] = useState<number[]>([]);

    const navData: NavData = useNavContext();
    const showToast: ToastStuff = useToast();

    const onError: () => void = useEffectEvent((): void => {
        showToast(MessageSeverity.ERROR, "Error getting years");
    });

    useEffect((): void => {
        apiClient("years")
            .then((res: Response): Promise<number[]> => res.json())
            .then((data: number[]): void => setYears(data))
            .catch((err: Error): void => {
                onError();
                console.error(err);
            });
    }, []);

    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="year-picker"
                          variant="filled"
                          onChange={(e: DropdownChangeEvent): void => navData.setYear(e.target.value)}
                          value={navData.year}
                          options={years}
                          optionLabel="year"
                          placeholder="Select year"/>
                <label htmlFor="year-picker">Year</label>
            </FloatLabel>
        </div>
    )
}