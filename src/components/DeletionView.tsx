import {Button} from "primereact/button";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {OverlayPanel} from "primereact/overlaypanel";
import type {Photo} from "../models/Photo.ts";
import {PhotoTable} from "./PhotoTable.tsx";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {apiClient} from "../utils/apiClient.tsx";

export function DeletionView(): React.ReactElement {
    const deleted = useRef<OverlayPanel>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect((): void => {
        apiClient("photos/deleted")
            .then((res: Response): Promise<Photo[]> => res.json())
            .then((data: Photo[]) => setPhotos(data))
            .catch((err): void => console.log(err));
    }, []);

    const accept: () => void = (): void => {
        apiClient("photos/deleted/nuke")
            .then(() => setPhotos([]))
            .catch((err): void => console.log(err));
    };

    const reject: () => void = (): void => {
    };

    const confirmNuke: () => void = (): void => {
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
                    className="nav-button"
                    icon="pi pi-trash"
                    label="Wastebin"
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
                        style={{width: "100%", marginTop: "1rem"}}/>
            </OverlayPanel>
        </div>
    )
}