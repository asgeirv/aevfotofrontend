import {OverlayPanel} from "primereact/overlaypanel";
import {Button} from "primereact/button";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import type {Photo} from "../models/Photo.ts";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import {PhotoTable} from "./PhotoTable.tsx";
import {apiClient} from "../utils/apiClient.tsx";

export function PortfolioView(): React.ReactElement {
    const portfolio = useRef<OverlayPanel>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [ratingThreshold, setRatingThreshold] = useState<number>(5);
    const availableRatings: number[] = [5, 4, 3, 2, 1];

    useEffect(() => {
        apiClient(`portfolio/${ratingThreshold}`)
            .then((res) => res.json())
            .then(data => setPhotos(data))
            .catch((err) => console.log(err));
    }, [ratingThreshold]);

    function downloadPortfolio(): void {
        apiClient(`portfolio/dl/${ratingThreshold}`)
            .then((res: Response): Promise<Blob> => res.blob())
            .then((blob: Blob): void => {
                const fileUrl: string = URL.createObjectURL(blob);
                const link: HTMLAnchorElement = document.createElement("a");
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
                                  onChange={(e: DropdownChangeEvent) => {
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

