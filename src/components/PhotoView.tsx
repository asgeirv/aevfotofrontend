import * as React from "react";
import {type ReactElement, useCallback, useEffect, useState} from "react";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";
import {Card} from "primereact/card";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import {Rating, type RatingChangeEvent} from "primereact/rating";
import type {Nullable} from "primereact/ts-helpers";
import type {Photo} from "../models/Photo.ts";
import {apiClient, fetchPhotoData} from "../utils/apiClient.tsx";
import type {PhotoData} from "../models/PhotoData.ts";
import {type AuthStuff, useAuth} from "../hooks/useAuth.tsx";

interface PhotoViewProps {
    photos: Photo[] | undefined;
}

export function PhotoView({photos}: PhotoViewProps): ReactElement {
    photos?.sort((a: Photo, b: Photo) => (a.filename < b.filename) ? -1 : (a.filename > b.filename) ? 1 : 0);
    const authStuff: AuthStuff = useAuth();
    const [currentId, setCurrentId] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [thumbImg, setThumbImg] = useState<string | undefined>();
    const [largeImg, setLargeImg] = useState<string | undefined>();

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
            .catch(err => console.log(err));

        // force update
        setCount(count + 1);
    }

    useEffect((): void => {
        if (photos && photos.length > 0) {
            fetchPhotoData(getCurrentPhoto().id, true)
                .then((img: PhotoData): void => setThumbImg(img.data));

            fetchPhotoData(getCurrentPhoto().id)
                .then((img: PhotoData): void => setLargeImg(img.data))
        }
    }, [photos, thumbImg, largeImg, getCurrentPhoto]);

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
                            <div className="photo">
                                <Image src={thumbImg}
                                       preview
                                       zoomSrc={largeImg}
                                       indicatorIcon="pi pi-search"
                                       className="photo"/>
                            </div>
                        </div>

                        <div id="photo-nav-container">
                            <Button icon="pi pi-arrow-left"
                                    onClick={previousPhoto}
                                    tooltip="Previous photo (Arrow Key Left)"
                                    tooltipOptions={{position: "right"}}/>

                            <Rating value={photos[currentId].rating}
                                    onChange={(e: RatingChangeEvent) => updateRating(getCurrentPhoto(), e.value)}
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