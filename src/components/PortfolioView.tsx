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

    function downloadPortfolio() {
        fetch(`http://localhost:8080/api/portfolio/dl/${ratingThreshold}`)
            .then(res => res.blob())
            .then((blob) => {
                const fileUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = "portfolio.zip";
                link.click();
                link.parentNode?.removeChild(link);
            })
    }

    return (
        <div>
            <Button type="button"
                    className="nav-button"
                    icon="pi pi-image"
                    label="Portfolio"
                    style={{marginBottom: "1rem"}}
                    onClick={(e) => portfolio.current?.toggle(e)}
            />
            <OverlayPanel ref={portfolio}
                          style={{maxWidth: "70%"}}>
                <div id="rating-container">
                    <div>
                        Rating threshold:
                        <Dropdown value={ratingThreshold}
                                  style={{marginLeft: "0.5rem"}}
                                  onChange={(e) => {
                                      setRatingThreshold(e.target.value);
                                  }}
                                  options={availableRatings}/>
                    </div>

                    <Button type="button"
                            icon="pi pi-download"
                            onClick={downloadPortfolio}
                            tooltip="Download"
                            tooltipOptions={{position: "top"}}/>
                </div>

                <PhotoTable photos={photos}
                            emptyMessage={"No rated photos, go rate some!"}/>
            </OverlayPanel>
        </div>
    );
}

