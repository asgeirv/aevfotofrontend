import * as React from "react";
import {type ReactElement, useCallback, useEffect, useEffectEvent, useState} from "react";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Rating, type RatingChangeEvent} from "primereact/rating";
import type {Nullable} from "primereact/ts-helpers";
import type {Photo} from "../models/Photo.ts";
import {apiClient, fetchPhotoData} from "../utils/apiClient.tsx";
import type {PhotoData} from "../models/PhotoData.ts";
import {type AuthStuff, useAuth} from "../hooks/useAuth.tsx";
import {type ToastSeverity, useToast} from "../context/ToastContext.tsx";
import {type NavData, useNavContext} from "../context/NavContext.tsx";
import {PhotoFrame} from "./PhotoFrame.tsx";

export function PhotoView(): ReactElement {
    const authStuff: AuthStuff = useAuth();
    const showToast: ((severity: ToastSeverity, message: string) => void) | undefined = useToast();
    const navData: NavData = useNavContext();

    const [photos, setPhotos] = useState<Photo[]>([]);
    const [currentId, setCurrentId] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [thumbImg, setThumbImg] = useState<string | undefined>();
    const [largeImg, setLargeImg] = useState<string | undefined>();

    const onError: () => void = useEffectEvent((): void => {
        showToast("error", `Error getting photos for ${navData.year}/${navData.month}/${navData.subfolder}`);
    });

    useEffect((): void => {
        if (navData.year && navData.month && navData.subfolder) {
            apiClient(`photos/${navData.year}/${navData.month}/${navData.subfolder}`)
                .then((res: Response): Promise<Photo[]> => res.json())
                .then((data: Photo[]): void => setPhotos(data))
                .catch(err => {
                    onError();
                    console.error(err);
                });
        } else if (navData.year && navData.month) {
            apiClient(`photos/${navData.year}/${navData.month}`)
                .then((res: Response): Promise<Photo[]> => res.json())
                .then((data: Photo[]): void => setPhotos(data))
                .catch(err => {
                    onError();
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

    const getCurrentPhoto: () => Photo = useCallback((): Photo => {
        if (photos && photos.length > 0) {
            return photos[currentId]
        } else {
            throw new Error("No photos found!");
        }
    }, [currentId, photos]);

    function updateRating(photo: Photo, rating: Nullable<number>): void {
        if (rating === undefined) {
            showToast?.("error", "Undefined rating")

            console.error("Undefined rating!");
            return;
        } else if (rating === null) {
            photo.rating = 0;
        } else {
            photo.rating = rating;
        }

        updatePhoto(photo);
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
                showToast?.("error", "Failed to update rating");
                console.log(err);
            });

        // force update
        setCount(count + 1);
    }

    useEffect((): void => {
        if (photos && photos.length > 0) {
            fetchPhotoData(getCurrentPhoto().id, true)
                .then((img: PhotoData): void => setThumbImg(img.data))
                .catch((err: Error): void => {
                    showToast?.("error", "Failed to fetch photos");
                    console.log(err);
                });

            fetchPhotoData(getCurrentPhoto().id)
                .then((img: PhotoData): void => setLargeImg(img.data))
                .catch((err: Error): void => {
                    showToast?.("error", "Failed to fetch photos");
                    console.log(err);
                });
        }
    }, [photos, thumbImg, largeImg, getCurrentPhoto, showToast]);

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
                    toggleDeletion(getCurrentPhoto());
                }
                break;
            case "0":
                if (photos && photos.length > 0) {
                    updateRating(getCurrentPhoto(), 0);
                }
                break;
            case "1":
                if (photos && photos.length > 0) {
                    updateRating(getCurrentPhoto(), 1);
                }
                break;
            case "2":
                if (photos && photos.length > 0) {
                    updateRating(getCurrentPhoto(), 2);
                }
                break;
            case "3":
                if (photos && photos.length > 0) {
                    updateRating(getCurrentPhoto(), 3);
                }
                break;
            case "4":
                if (photos && photos.length > 0) {
                    updateRating(getCurrentPhoto(), 4);
                }
                break;
            case "5":
                if (photos && photos.length > 0) {
                    updateRating(getCurrentPhoto(), 5);
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
                            <PhotoFrame photo={getCurrentPhoto()}
                                        imageClassName="photo"/>
                        </div>

                        <div id="photo-nav-container">
                            <Button icon="pi pi-arrow-left"
                                    onClick={previousPhoto}
                                    tooltip="Previous photo (Arrow Key Left)"
                                    tooltipOptions={{position: "right"}}/>

                            <Rating value={photos[currentId].rating}
                                    onChange={(e: RatingChangeEvent): void => updateRating(getCurrentPhoto(), e.value)}
                                    readOnly={!authStuff.canWrite()}/>

                            <Button icon="pi pi-arrow-right"
                                    onClick={nextPhoto}
                                    tooltip="Next photo (Arrow Key Right)"
                                    tooltipOptions={{position: "left"}}/>
                        </div>

                        {authStuff.canWrite() ? (
                            <div id="photo-del-container">
                                <Button
                                    icon={photos[currentId].flaggedForDeletion ? "pi pi-undo" : "pi pi-trash"}
                                    severity="danger"
                                    onClick={(): void => toggleDeletion(getCurrentPhoto())}
                                    tooltip="Mark for deletion (Del)"
                                    tooltipOptions={{position: "bottom"}}/>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <p>No photos found!</p>
                )}
            </Card>
        </div>
    )
}