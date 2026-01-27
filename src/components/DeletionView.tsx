import {Button} from "primereact/button";
import {useEffect, useRef, useState} from "react";
import {OverlayPanel} from "primereact/overlaypanel";
import type {Photo} from "../models/Photo.ts";
import {PhotoTable} from "./PhotoTable.tsx";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";

export function DeletionView() {
    const deleted = useRef<OverlayPanel>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/photos/deleted`)
            .then((res) => res.json())
            .then(data => setPhotos(data))
            .catch((err) => console.log(err));
    }, []);

    const accept = () => {
        fetch(`http://localhost:8080/api/photos/deleted/nuke`,
            {
                method: "DELETE",
            })
            .then(() => setPhotos([]))
            .catch((err) => console.log(err));
    };

    const reject = () => {};

    const confirmNuke = () => {
        confirmDialog({
            message: "Are you sure you want to permanently delete all photos marked for deletion?",
            header: "Confirm deletion",
            icon: "pi pi-exclamation-triangle",
            defaultFocus: "reject",
            accept,
            reject
        })
    }

    return (
        <div>
            <Button type="button"
                    icon="pi pi-trash"
                    onClick={(e) => deleted.current?.toggle(e)}/>

            <OverlayPanel ref={deleted}>
                <PhotoTable photos={photos}
                            emptyMessage={"No photos flagged for deletion."}/>

                <ConfirmDialog/>
                <Button type="button"
                        icon="pi pi-trash"
                        severity="danger"
                        size="large"
                        onClick={confirmNuke}
                        style={{width: "100%"}}/>
            </OverlayPanel>
        </div>
    )
}