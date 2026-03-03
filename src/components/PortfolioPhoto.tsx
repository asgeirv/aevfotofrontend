import {type ReactElement, useEffect, useState} from "react";
import {fetchPhotoData} from "../utils/apiClient.tsx";
import type {Photo} from "../models/Photo.ts";
import type {PhotoData} from "../models/PhotoData.ts";
import {Image} from "primereact/image";
import {Spinner} from "./Spinner.tsx";

interface PhotoProps {
    photo: Photo;
}

export function PortfolioPhoto({photo}: PhotoProps): ReactElement {
    const [thumbData, setThumbData] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect((): void => {
        fetchPhotoData(photo.id, true)
            .then((data: PhotoData): void => setThumbData(data.data))
            .then((): void => setIsLoading(false))
    }, [setThumbData, isLoading, photo.id]);

    return (
        (
            isLoading ? <Spinner/>
                :
                <>
                    <Image loading="lazy"
                           src={thumbData}
                           preview
                           indicatorIcon="pi pi-search"
                           imageClassName="portfolio-thumb"/>
                </>
        )
    );
}