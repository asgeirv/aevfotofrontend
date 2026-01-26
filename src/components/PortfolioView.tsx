import {OverlayPanel} from "primereact/overlaypanel";
import {Button} from "primereact/button";
import {useEffect, useRef, useState} from "react";
import type {Photo} from "../models/Photo.ts";
import {Dropdown} from "primereact/dropdown";
import {PhotoTable} from "./PhotoTable.tsx";

export function PortfolioView() {
    const portfolio = useRef<OverlayPanel>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [ratingThreshold, setRatingThreshold] = useState<number>(5);
    const availableRatings: number[] = [5, 4, 3, 2, 1];

    useEffect(() => {
        fetch(`http://localhost:8080/api/portfolio/${ratingThreshold}`)
            .then((res) => res.json())
            .then(data => setPhotos(data))
            .catch((err) => console.log(err));
    }, [ratingThreshold]);

    return (
        <div>
            <Button type="button"
                    icon="pi pi-image"
                    label="Portfolio"
                    onClick={(e) => portfolio.current?.toggle(e)}
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

                <PhotoTable photos={photos}
                            emptyMessage={"No rated photos, go rate some!"}/>
            </OverlayPanel>
        </div>
    );
}

