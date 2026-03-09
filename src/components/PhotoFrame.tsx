import {type ReactElement, useEffect, useEffectEvent, useState} from "react";
import {fetchPhotoData} from "../utils/apiClient.tsx";
import type {Photo} from "../models/Photo.ts";
import type {PhotoData} from "../models/PhotoData.ts";
import {Image} from "primereact/image";
import {Spinner} from "./Spinner.tsx";

interface PhotoProps {
    photo: Photo;
    imageClassName: string;
}

export function PhotoFrame({photo, imageClassName}: PhotoProps): ReactElement {
    console.log(`Rendering photo frame for photo: ${photo.id}!`)
    const [thumbData, setThumbData] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchPhoto: (photo: Photo) => void = useEffectEvent((photo: Photo): void => {
        fetchPhotoData(photo.id, true)
            .then((data: PhotoData): void => setThumbData(data.data))
            .then((): void => setIsLoading(false))
    })

    useEffect((): void => {
        fetchPhoto(photo);
    }, [photo]);

    return (
        (
            isLoading ? <Spinner/>
                :
                <>
                    <Image loading="lazy"
                           src={thumbData}
                           preview
                           indicatorIcon="pi pi-search"
                           imageClassName={imageClassName}/>
                </>
        )
    );
}