import {type ReactElement, useEffect, useState} from "react";
import {fetchPhotoData} from "../utils/apiClient.tsx";
import type {Photo} from "../models/Photo.ts";
import type {PhotoData} from "../models/PhotoData.ts";
import {Image} from "primereact/image";

interface PhotoProps {
    photo: Photo;
}

export function PortfolioPhoto({photo}: PhotoProps): ReactElement {
    const [thumbData, setThumbData] = useState<string>();
    const [photoData, setPhotoData] = useState<string>();

    useEffect((): void => {
        fetchPhotoData(photo.id, true)
            .then((data: PhotoData): void => setThumbData(data.data));

        fetchPhotoData(photo.id)
            .then((data: PhotoData): void => setPhotoData(data.data));
    });

    return (
        <>
            <Image src={thumbData}
                   preview
                   zoomSrc={photoData}
                   indicatorIcon="pi pi-search"
                   imageClassName="portfolio-thumb"/>
        </>
    );
}