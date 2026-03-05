import type {Photo} from "../models/Photo.ts";
import type {ReactElement} from "react";
import {PortfolioPhoto} from "./PortfolioPhoto.tsx";

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
                                    <PortfolioPhoto photo={photo}/>
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