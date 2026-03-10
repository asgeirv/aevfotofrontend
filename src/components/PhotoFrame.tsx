import {type ReactElement, useEffect, useEffectEvent, useState} from "react";
import {fetchPhotoData} from "../utils/apiClient.tsx";
import type {PhotoData} from "../models/PhotoData.ts";
import {Image} from "primereact/image";
import {Spinner} from "./Spinner.tsx";

interface PhotoProps {
    photoId: number;
    imageClassName: string;
}

export function PhotoFrame({photoId, imageClassName}: PhotoProps): ReactElement {
    const [thumbData, setThumbData] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchPhoto: (photoId: number) => void = useEffectEvent((photoId: number): void => {
        setIsLoading(true);

        fetchPhotoData(photoId, true)
            .then((data: PhotoData): void => setThumbData(data.data))
            .then((): void => setIsLoading(false))
    })

    useEffect((): void => {
        fetchPhoto(photoId);
    }, [photoId]);

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