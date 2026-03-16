import {FloatLabel} from "primereact/floatlabel";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import {type ReactElement, useEffect, useEffectEvent, useState} from "react";
import {type NavData, useNavContext} from "../context/NavContext.tsx";
import {apiClient} from "../utils/apiClient.tsx";
import {type ToastStuff, useToast} from "../context/ToastContext.tsx";
import {MessageSeverity} from "primereact/api";

export function SubfolderPicker(): ReactElement {
    const [subfolders, setSubfolders] = useState<string[]>([]);

    const navData: NavData = useNavContext();
    const showToast: ToastStuff = useToast();

    const onError: (message: string) => void = useEffectEvent((message: string): void => {
        showToast(MessageSeverity.ERROR, message);
    });

    useEffect((): void => {
        if (navData.year && navData.month) {
            apiClient(`${navData.year}/${navData.month}/subfolders`)
                .then((res: Response): Promise<string[]> => res.json())
                .then((data: string[]): void => setSubfolders(data))
                .catch((err: Error): void => {
                    onError(`Error getting subfolders for ${navData.year}/${navData.month}`);
                    console.error(err);
                });
        }
    }, [navData.year, navData.month]);

    const disabled: boolean = !subfolders || subfolders.length == 0;

    if (disabled) {
        navData.setSubfolder(undefined);
    }

    const placeholder: () => (string) = () => {
        return disabled ? "No subfolders" : "Subfolder";
    }

    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="subfolder-picker"
                          variant="filled"
                          disabled={disabled}
                          onChange={(e: DropdownChangeEvent): void => navData.setSubfolder(e.target.value)}
                          value={navData.subfolder}
                          options={subfolders}
                          optionLabel="name"
                          placeholder={placeholder()}
                          showClear/>
                <label htmlFor="subfolder-picker">{placeholder()}</label>
            </FloatLabel>
        </div>
    );
}