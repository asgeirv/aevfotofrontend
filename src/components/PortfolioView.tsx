import {OverlayPanel} from "primereact/overlaypanel";
import {Button} from "primereact/button";
import {useEffect, useRef, useState} from "react";
import type {Photo} from "../models/Photo.ts";
import {Galleria} from "primereact/galleria";
import {Dropdown} from "primereact/dropdown";

export function PortfolioView() {
    const portfolio = useRef<OverlayPanel>(null);
    const galleria = useRef<Galleria>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [ratingThreshold, setRatingThreshold] = useState<number>(5);
    const availableRatings: number[] = [5, 4, 3, 2, 1];

    useEffect(() => {
        fetch(`http://localhost:8080/api/portfolio/${ratingThreshold}`)
            .then((res) => res.json())
            .then(data => setPhotos(data))
            .catch((err) => console.log(err));
    }, [ratingThreshold]);

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

    return (
        <div>
            <Button type="button"
                    icon="pi pi-image"
                    label="Portfolio"
                    onClick={(e) => portfolio.current.toggle(e)}
            />
            <OverlayPanel ref={portfolio}
                          style={{maxWidth: "70%"}}>
                <div style={{marginBottom: "1rem"}}>
                    Rating threshold:
                    <Dropdown value={ratingThreshold}
                              style={{marginLeft: "0.5rem"}}
                              onChange={(e) => {
                                  setRatingThreshold(e.target.value);
                              }}
                              options={availableRatings}/>
                </div>

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
                                         galleria.current.show();
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
            </OverlayPanel>
        </div>
    );
}

