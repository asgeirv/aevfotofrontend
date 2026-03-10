import type {Photo} from "../models/Photo.ts";
import type {ReactElement} from "react";
import {PhotoFrame} from "./PhotoFrame.tsx";

interface PhotoTableProps {
    photos: Photo[] | undefined;
    emptyMessage: string;
}

export function PhotoTable({photos, emptyMessage}: PhotoTableProps): ReactElement {
    if (photos && photos.length > 0) {
        return (
            <>
                <div id="portfolio-grid">
                    {
                        photos && photos.map((photo: Photo, index: number): ReactElement => {
                            return (
                                <div key={index}
                                     className="portfolio-thumb">
                                    <PhotoFrame photoId={photo.id}
                                                imageClassName="portfolio-thumb"/>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    } else {
        return (
            <p>{emptyMessage}</p>
        )
    }
}