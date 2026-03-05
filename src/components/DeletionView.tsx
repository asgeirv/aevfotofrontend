import {Button} from "primereact/button";
import * as React from "react";
import {useRef} from "react";
import {OverlayPanel} from "primereact/overlaypanel";
import type {Photo} from "../models/Photo.ts";
import {PhotoTable} from "./PhotoTable.tsx";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {apiClient} from "../utils/apiClient.tsx";
import {type AuthStuff, useAuth} from "../hooks/useAuth.tsx";

interface DeletionViewProps {
    photos: Photo[];
    setPhotos: (photos: Photo[]) => void;
}

export function DeletionView({photos, setPhotos}: DeletionViewProps): React.ReactElement {
    const authStuff: AuthStuff = useAuth();
    const deleted: React.RefObject<OverlayPanel | null> = useRef<OverlayPanel>(null);

    const accept: () => void = (): void => {
        apiClient("photos/deleted/nuke",
            {
                method: "DELETE"
            })
            .then((): void => setPhotos([]))
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
                    onClick={(e): void | undefined => deleted.current?.toggle(e)}/>

            <OverlayPanel ref={deleted}>
                {authStuff.canWrite() && photos && photos.length > 0 ? (
                    <>
                        <ConfirmDialog/>
                        <Button type="button"
                                icon="pi pi-trash"
                                severity="danger"
                                size="large"
                                onClick={confirmNuke}
                                style={{width: "100%", marginBottom: "1rem"}}/>
                    </>
                ) : null}

                <PhotoTable photos={photos}
                            emptyMessage={"No photos flagged for deletion."}/>
            </OverlayPanel>
        </div>
    )
}