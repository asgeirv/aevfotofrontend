import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";
import {Card} from "primereact/card";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import {Rating} from "primereact/rating";
import type {Nullable} from "primereact/ts-helpers";
import type {Photo} from "../models/Photo.ts";

interface PhotoViewProps {
    photos: Photo[] | undefined;
}

export function PhotoView({photos}: PhotoViewProps) {
    photos?.sort((a: Photo, b: Photo) => (a.filename < b.filename) ? -1 : (a.filename > b.filename) ? 1 : 0);
    const [currentId, setCurrentId] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [thumbImg, setThumbImg] = useState<string>();
    const [largeImg, setLargeImg] = useState<string>();
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${localStorage.getItem("token")}`);

    if (photos && currentId > photos.length) {
        setCurrentId(0);
    }
    const cardTitle: string = photos && photos.length > 0 ? `Photo ${currentId + 1} / ${photos.length}` : "No photos found!";

    function previousPhoto() {
        if (photos) {
            if (currentId === 0) {
                setCurrentId(photos?.length - 1);
            } else {
                setCurrentId(currentId - 1);
            }
        }
    }

    function nextPhoto() {
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

    function updateRating(photo: Photo, rating: Nullable<number>) {
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

    function toggleDeletion(photo: Photo) {
        photo.flaggedForDeletion = !photo.flaggedForDeletion;
        updatePhoto(photo);
    }

    function updatePhoto(photo: Photo) {
        fetch(`http://localhost:8080/api/photo`,
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

    function arrayBufferToBase64(buffer: ArrayBuffer): string {
        console.log(buffer)
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }

    useEffect(() => {
        if (photos && photos.length > 0) {
            fetch(`http://localhost:8080/api/photo/${getCurrentPhoto().id}/thumbnail`,
                {headers})
                .then((res: Response): Promise<ArrayBuffer> => res.arrayBuffer())
                .then((data: ArrayBuffer): void => {
                    const base64: string = arrayBufferToBase64(data);
                    setThumbImg(`data:image/jpg;base64,${base64}`);
                })
                .catch(err => console.log(err));
        }
    }, [photos, headers, thumbImg, getCurrentPhoto]);

    useEffect(() => {
        if (photos && photos.length > 0) {
            fetch(`http://localhost:8080/api/photo/${getCurrentPhoto().id}`,
                {headers})
                .then((res: Response): Promise<ArrayBuffer> => res.arrayBuffer())
                .then((data: ArrayBuffer): void => {
                    const base64: string = arrayBufferToBase64(data);
                    setLargeImg(`data:image/jpg;base64,${base64}`);
                })
                .catch(err => console.log(err));
        }
    }, [getCurrentPhoto, headers, thumbImg, photos]);

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
            <Card title={cardTitle}>
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
                                    onChange={(e) => updateRating(getCurrentPhoto(), e.value)}/>

                            <Button icon="pi pi-arrow-right"
                                    onClick={nextPhoto}
                                    tooltip="Next photo (Arrow Key Right)"
                                    tooltipOptions={{position: "left"}}/>
                        </div>

                        <div id="photo-del-container">
                            <Button icon={photos[currentId].flaggedForDeletion ? "pi pi-undo" : "pi pi-trash"}
                                    severity="danger"
                                    onClick={() => toggleDeletion(getCurrentPhoto())}
                                    tooltip="Mark for deletion (Del)"
                                    tooltipOptions={{position: "bottom"}}/>
                        </div>
                    </>
                ) : (
                    <p></p>
                )}
            </Card>
        </div>
    )
}