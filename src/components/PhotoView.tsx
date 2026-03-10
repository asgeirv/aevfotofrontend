import * as React from "react";
import {type ReactElement, useEffect, useEffectEvent, useState} from "react";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import type {Photo} from "../models/Photo.ts";
import {apiClient} from "../utils/apiClient.tsx";
import {type AuthStuff, useAuth} from "../hooks/useAuth.tsx";
import {useToast} from "../context/ToastContext.tsx";
import {type NavData, useNavContext} from "../context/NavContext.tsx";
import {PhotoFrame} from "./PhotoFrame.tsx";
import {MessageSeverity} from "primereact/api";
import {PhotoRater} from "./PhotoRater.tsx";

export function PhotoView(): ReactElement {
    const authStuff: AuthStuff = useAuth();
    const showToast: ((severity: MessageSeverity, message: string) => void) = useToast();
    const navData: NavData = useNavContext();

    const [photos, setPhotos] = useState<Photo[]>([]);
    const [currentId, setCurrentId] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const onError: (message: string) => void = useEffectEvent((message: string): void => {
        showToast(MessageSeverity.ERROR, message);
    });

    useEffect((): void => {
        if (navData.year && navData.month && navData.subfolder) {
            apiClient(`photos/${navData.year}/${navData.month}/${navData.subfolder}`)
                .then((res: Response): Promise<Photo[]> => res.json())
                .then((data: Photo[]): void => setPhotos(data))
                .catch(err => {
                    onError(`Error getting photos for ${navData.year}/${navData.month}/${navData.subfolder}`);
                    console.error(err);
                });
        } else if (navData.year && navData.month) {
            apiClient(`photos/${navData.year}/${navData.month}`)
                .then((res: Response): Promise<Photo[]> => res.json())
                .then((data: Photo[]): void => setPhotos(data))
                .catch(err => {
                    onError(`Error getting photos for ${navData.year}/${navData.month}`);
                    console.error(err);
                });
        }
    }, [navData.year, navData.month, navData.subfolder]);

    photos?.sort((a: Photo, b: Photo) => (a.filename < b.filename) ? -1 : (a.filename > b.filename) ? 1 : 0);

    if (photos && currentId > photos.length) {
        setCurrentId(0);
    }

    function previousPhoto(): void {
        if (photos) {
            if (currentId === 0) {
                setCurrentId(photos?.length - 1);
            } else {
                setCurrentId(currentId - 1);
            }
        }
    }

    function nextPhoto(): void {
        if (photos) {
            if (currentId === photos?.length - 1) {
                setCurrentId(0);
            } else {
                setCurrentId(currentId + 1);
            }
        }
    }

    function toggleDeletion(photo: Photo): void {
        photo.flaggedForDeletion = !photo.flaggedForDeletion;
        updatePhoto(photo);
    }

    function updatePhoto(photo: Photo): void {
        apiClient("photo",
            {
                method: "POST",
                body: JSON.stringify(photo),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .catch(err => {
                showToast(MessageSeverity.ERROR, "Failed to update rating");
                console.log(err);
            });

        // force update
        setCount(count + 1);
    }

    function onKeyDown(e: React.KeyboardEvent): void {
        switch (e.key) {
            case "ArrowLeft":
                previousPhoto();
                break;
            case "ArrowRight":
                nextPhoto();
                break;
            case "Delete":
                if (photos && photos.length > 0) {
                    toggleDeletion(photos[currentId]);
                }
                break;
        }
    }

    useGlobalKeydown((e: React.KeyboardEvent): void => {
        onKeyDown(e);
    })

    return (
        <div id="image-container">
            <Card title={
                <div className="photo-card-header">
                    <div>
                        {photos && photos.length > 0 ? `Photo ${currentId + 1} / ${photos.length}` : ""}
                    </div>

                    <div>
                        Logged in as: {authStuff.getUsername()}
                    </div>
                </div>
            }>
                {photos && photos.length > 0 ? (
                    <>
                        <div className="photo-container">
                            <PhotoFrame photoId={photos[currentId].id}
                                        imageClassName="photo"/>
                        </div>

                        <div className="photo-nav-container">
                            <Button icon="pi pi-arrow-left"
                                    onClick={previousPhoto}
                                    tooltip="Previous photo (Arrow Key Left)"
                                    tooltipOptions={{position: "bottom"}}/>

                            <PhotoRater photos={photos}
                                        currentId={currentId}
                                        setCurrentId={setCurrentId}
                                        updatePhoto={updatePhoto}
                                        readOnly={!authStuff.canWrite()}/>


                            <Button icon="pi pi-arrow-right"
                                    onClick={nextPhoto}
                                    tooltip="Next photo (Arrow Key Right)"
                                    tooltipOptions={{position: "bottom"}}/>
                        </div>

                        {authStuff.canWrite() ? (
                            <div id="photo-del-container">
                                <Button
                                    icon={photos[currentId].flaggedForDeletion ? "pi pi-undo" : "pi pi-trash"}
                                    severity="danger"
                                    onClick={(): void => toggleDeletion(photos[currentId])}
                                    tooltip="Mark for deletion (Del)"
                                    tooltipOptions={{position: "bottom"}}/>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <p className="photo-container">No photos found!</p>
                )}
            </Card>
        </div>
    )
}