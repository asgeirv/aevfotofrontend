import {FloatLabel} from "primereact/floatlabel";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import type {ReactElement} from "react";

interface SubfolderPickerProps {
    subfolders: string[] | undefined;
    selectedSubfolder: string | undefined;
    setSelectedSubfolder: (subfolder: string | undefined) => void;
}

export function SubfolderPicker({
                                    subfolders,
                                    selectedSubfolder,
                                    setSelectedSubfolder
                                }: SubfolderPickerProps): ReactElement {
    const disabled: boolean = !subfolders || subfolders.length == 0;

    if (disabled) {
        setSelectedSubfolder(undefined);
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
                          onChange={(e: DropdownChangeEvent): void => setSelectedSubfolder(e.target.value)}
                          value={selectedSubfolder}
                          options={subfolders}
                          optionLabel="name"
                          placeholder={placeholder()}
                          showClear/>
                <label htmlFor="subfolder-picker">{placeholder()}</label>
            </FloatLabel>
        </div>
    );
}