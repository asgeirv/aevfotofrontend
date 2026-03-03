import type {ReactElement} from "react";

export function Spinner(): ReactElement {
    return (
        <div style={{margin: "3rem"}}>
            <i className="pi pi-spinner pi-spin"/>
        </div>
    );
}