import type {ReactElement} from "react";
import {YearPicker} from "./YearPicker.tsx";
import {MonthPicker} from "./MonthPicker.tsx";
import {SubfolderPicker} from "./SubfolderPicker.tsx";

export function PhotoNav(): ReactElement {

    return (
        <div className="date-nav">
            <YearPicker/>
            <MonthPicker/>
            <SubfolderPicker/>
        </div>
    )
}