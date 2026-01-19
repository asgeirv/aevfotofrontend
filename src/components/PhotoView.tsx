import {useState} from "react";
import * as React from "react";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";
import {Card} from "primereact/card";
import {Image} from "primereact/image";
import {Button} from "primereact/button";
import {Rating} from "primereact/rating";

interface PhotoViewProps {
    photoIds: number[];
}

export function PhotoView({photoIds}: PhotoViewProps) {
    const [currentPhoto, setCurrentPhoto] = useState<number>(0);
    if (currentPhoto > photoIds.length) {
        setCurrentPhoto(0);
    }
    const cardTitle: string = photoIds.length > 0 ? `Photo ${currentPhoto + 1} / ${photoIds.length}` : "No photos found!";

    function previousPhoto() {
        if (currentPhoto === 0) {
            setCurrentPhoto(photoIds?.length - 1);
        } else {
            setCurrentPhoto(currentPhoto - 1);
        }
    }

    function nextPhoto() {
        if (currentPhoto === photoIds?.length - 1) {
            setCurrentPhoto(0);
        } else {
            setCurrentPhoto(currentPhoto + 1);
        }
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
                <>
                    <div className="photo">
                        <Image src={"http://localhost:8080/api/photo/" + photoIds[currentPhoto]}
                               height="100%"/>
                    </div>
                    <div id="photo-nav-container">
                        <Button icon="pi pi-arrow-left"
                                onClick={previousPhoto}/>

                        <Rating/>

                        <Button icon="pi pi-arrow-right"
                                onClick={nextPhoto}/>
                    </div>
                    <div id="photo-del-container">
                        <Button icon="pi pi-trash"
                                severity="danger"
                                onClick={deletePhoto}/>
                    </div>
                </>
            </Card>
        </div>
    )
}