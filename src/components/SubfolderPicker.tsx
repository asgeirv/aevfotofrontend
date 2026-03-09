import {FloatLabel} from "primereact/floatlabel";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import {type ReactElement, useContext, useEffect, useState} from "react";
import {type NavData, useNavContext} from "../context/NavContext.tsx";
import {apiClient} from "../utils/apiClient.tsx";
import {ToastContext, type ToastContextType} from "../context/ToastContext.tsx";

export function SubfolderPicker(): ReactElement {
    const [subfolders, setSubfolders] = useState<string[]>([]);

    const navData: NavData = useNavContext();
    const showToast: ToastContextType | undefined = useContext(ToastContext);

    useEffect((): void => {
        if (navData.year && navData.month) {
            apiClient(`${navData.year}/${navData.month}/subfolders`)
                .then((res: Response): Promise<string[]> => res.json())
                .then((data: string[]): void => setSubfolders(data))
                .catch((err: Error): void => {
                    showToast?.("error", `Error getting subfolders for ${navData.year}/${navData.month}`);
                    console.error(err);
                });
        }
    }, [navData.year, navData.month, showToast]);

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