import * as React from "react";
import {useState} from "react";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";
import {Card} from "primereact/card";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import {Rating} from "primereact/rating";
import type {Nullable} from "primereact/ts-helpers";
import type {Photo} from "../models/Photo.ts";

interface PhotoViewProps {
    photos: Photo[];
}

export function PhotoView({photos}: PhotoViewProps) {
    const [currentPhoto, setCurrentPhoto] = useState<number>(0);
    if (currentPhoto > photos.length) {
        setCurrentPhoto(0);
    }
    const cardTitle: string = photos.length > 0 ? `Photo ${currentPhoto + 1} / ${photos.length}` : "No photos found!";

    function previousPhoto() {
        if (currentPhoto === 0) {
            setCurrentPhoto(photos?.length - 1);
        } else {
            setCurrentPhoto(currentPhoto - 1);
        }
    }

    function nextPhoto() {
        if (currentPhoto === photos?.length - 1) {
            setCurrentPhoto(0);
        } else {
            setCurrentPhoto(currentPhoto + 1);
        }
    }

    function updateRating(photo: Photo, rating: Nullable<number>) {
        if (rating === undefined) {
            console.error("Undefined rating!");
            return;
        } else if (rating === null) {
            photo.rating = 0;
        } else {
            photo.rating = rating;
        }

        fetch(`http://localhost:8080/api/photo`,
            {
                method: "POST",
                body: JSON.stringify(photo),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .catch(err => console.log(err));

    }

    function deletePhoto() {

    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'ArrowLeft') {
            previousPhoto();
        } else if (e.key === 'ArrowRight') {
            nextPhoto();
        }
    }

    useGlobalKeydown((e: React.KeyboardEvent) => {
        onKeyDown(e);
    })

    return (
        <div id="image-container">
            <Card title={cardTitle}>
                {photos && photos.length > 0 ? (
                    <>
                        <div className="photo">
                            <Image src={"http://localhost:8080/api/photo/" + photos[currentPhoto].id + "/thumbnail"}
                                   preview
                                   zoomSrc={"http://localhost:8080/api/photo/" + photos[currentPhoto].id}
                                   indicatorIcon="pi pi-search"
                                   max-height="533"/>
                        </div>
                        <div id="photo-nav-container">
                            <Button icon="pi pi-arrow-left"
                                    onClick={previousPhoto}/>

                            <Rating value={photos[currentPhoto].rating}
                                    onChange={(e) => updateRating(photos[currentPhoto], e.value)}/>

                            <Button icon="pi pi-arrow-right"
                                    onClick={nextPhoto}/>
                        </div>
                        <div id="photo-del-container">
                            <Button icon="pi pi-trash"
                                    severity="danger"
                                    onClick={deletePhoto}/>
                        </div>
                    </>
                ) : (
                    <p></p>
                )}
            </Card>
        </div>
    )
}