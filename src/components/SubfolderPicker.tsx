import {FloatLabel} from "primereact/floatlabel";
import {Dropdown} from "primereact/dropdown";

interface SubfolderPickerProps {
    subfolders: string[];
    selectedSubfolder: string | undefined;
    setSelectedSubfolder: (subfolder: string) => void;
}

export function SubfolderPicker({subfolders, selectedSubfolder, setSelectedSubfolder}: SubfolderPickerProps) {
    const options: string[] = subfolders ? subfolders : [];
    const disabled: boolean = options.length === 0;

    if (subfolders[0]) {
        return (
            <div className="datepicker-container">
                <FloatLabel>
                    <Dropdown inputId="subfolder-picker"
                              disabled={disabled}
                              value={selectedSubfolder}
                              onChange={e => setSelectedSubfolder(e.target.value)}
                              options={subfolders}
                              placeholder={selectedSubfolder}/>
                    <label htmlFor="subfolder-picker">Subfolder</label>
                </FloatLabel>
            </div>
        );
    } else {
        return null;
    }
}