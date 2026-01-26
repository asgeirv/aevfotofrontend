import type {Photo} from "../models/Photo.ts";
import {Galleria} from "primereact/galleria";
import {useRef, useState} from "react";

interface PhotoTableProps {
    photos: Photo[] | undefined;
    emptyMessage: string;
}

export function PhotoTable({photos, emptyMessage}: PhotoTableProps) {
    const galleria = useRef<Galleria>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const itemTemplate = (item: Photo) => {
        return <img src={`http://localhost:8080/api/photo/${item.id}`}
                    alt={item.filename}
                    style={{maxHeight: "850px"}}/>
    }

    const thumbTemplate = (item: Photo) => {
        return <img src={`http://localhost:8080/api/photo/${item.id}/thumbnail`}
                    alt={item.filename}
                    style={{maxHeight: "100px"}}/>
    }

    if (photos && photos.length > 0) {
        return (
            <>
                <Galleria ref={galleria}
                          activeIndex={activeIndex}
                          onItemChange={(e) => setActiveIndex(e.index)}
                          value={photos}
                          showIndicators={true}
                          circular
                          fullScreen
                          showItemNavigators
                          showThumbnails={false}
                          numVisible={10}
                          item={itemTemplate}
                          thumbnail={thumbTemplate}
                />

                <div id="portfolio-grid">
                    {
                        photos && photos.map((photo: Photo, index) => {
                            const imgElement =
                                <img src={`http://localhost:8080/api/photo/${photo.id}/thumbnail`}
                                     alt={photo.filename}
                                     className="portfolio-thumbnail"
                                     onClick={() => {
                                         setActiveIndex(index);
                                         galleria.current?.show();
                                     }}
                                />

                            return (
                                <div key={index}
                                     className="portfolio-img">
                                    {imgElement}
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