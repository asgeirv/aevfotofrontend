import {Button} from "primereact/button";
import * as React from "react";
import {useEffect, useEffectEvent, useRef, useState} from "react";
import {OverlayPanel} from "primereact/overlaypanel";
import type {Photo} from "../models/Photo.ts";
import {PhotoTable} from "./PhotoTable.tsx";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {apiClient} from "../utils/apiClient.tsx";
import {type AuthStuff, useAuth} from "../hooks/useAuth.tsx";
import {type ToastStuff, useToast} from "../context/ToastContext.tsx";
import {MessageSeverity} from "primereact/api";

export function DeletionView(): React.ReactElement {
    const authStuff: AuthStuff = useAuth();
    const showToast: ToastStuff = useToast();
    const deletedPanel: React.RefObject<OverlayPanel | null> = useRef<OverlayPanel>(null);
    const [deletedPhotos, setDeletedPhotos] = useState<Photo[]>([]);

    const onError: (message: string) => void = useEffectEvent((message: string): void => {
        showToast(MessageSeverity.ERROR, message);
    });

    useEffect((): void => {
        apiClient("photos/deleted")
            .then((res: Response): Promise<Photo[]> => res.json())
            .then((data: Photo[]): void => setDeletedPhotos(data))
            .catch((err: Error): void => {
                onError("Error getting photos flagged for deletion");
                console.log(err);
            });
    }, []);

    const accept: () => void = (): void => {
        apiClient("photos/deleted/nuke",
            {
                method: "DELETE"
            })
            .then((): void => {
                showToast(MessageSeverity.INFO, "Deleted all flagged photos");
                setDeletedPhotos([]);
            })
            .catch((err: Error): void => {
                showToast(MessageSeverity.ERROR, "Error deleting photos. Some may not have been deleted.");
                console.log(err);
            });
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
                    badge={deletedPhotos.length.toString()}
                    onClick={(e): void | undefined => deletedPanel.current?.toggle(e)}/>

            <OverlayPanel ref={deletedPanel}>
                {authStuff.canWrite() && deletedPhotos && deletedPhotos.length > 0 ? (
                    <>
                        <ConfirmDialog/>
                        <Button type="button"
                                icon="pi pi-trash"
                                tooltip="Permanently delete all photos marked for deletion"
                                tooltipOptions={{position: "top"}}
                                severity="danger"
                                size="large"
                                onClick={confirmNuke}
                                style={{width: "100%", marginBottom: "1rem"}}/>
                    </>
                ) : null}

                <PhotoTable photos={deletedPhotos}
                            emptyMessage={"No photos flagged for deletion."}/>
            </OverlayPanel>
        </div>
    )
}