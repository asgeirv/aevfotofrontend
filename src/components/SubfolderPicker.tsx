import {FloatLabel} from "primereact/floatlabel";
import {Dropdown} from "primereact/dropdown";
import type {Subfolder} from "../models/Subfolder.ts";

interface SubfolderPickerProps {
    subfolders: Subfolder[] | undefined;
    selectedSubfolder: Subfolder | undefined;
    setSelectedSubfolder: (subfolder: Subfolder) => void;
}

export function SubfolderPicker({subfolders, selectedSubfolder, setSelectedSubfolder}: SubfolderPickerProps) {
    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="subfolder-picker"
                          variant="filled"
                          disabled={!subfolders || subfolders.length == 0}
                          onChange={e => setSelectedSubfolder(e.target.value)}
                          value={selectedSubfolder}
                          options={subfolders}
                          optionLabel="name"
                          placeholder="Select subfolder"
                          showClear/>
                <label htmlFor="subfolder-picker">Subfolder</label>
            </FloatLabel>
        </div>
    );
}