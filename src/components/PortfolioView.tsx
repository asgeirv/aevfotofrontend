import {OverlayPanel} from "primereact/overlaypanel";
import {Button} from "primereact/button";
import * as React from "react";
import {useEffect, useEffectEvent, useRef, useState} from "react";
import type {Photo, PhotoRating} from "../models/Photo.ts";
import {Dropdown, type DropdownChangeEvent} from "primereact/dropdown";
import {PhotoTable} from "./PhotoTable.tsx";
import {apiClient} from "../utils/apiClient.tsx";
import {type ToastData, useToast} from "../context/ToastContext.tsx";
import {PortfolioDownload} from "./PortfolioDownload.tsx";
import {MessageSeverity} from "primereact/api";

export function PortfolioView(): React.ReactElement {
    const showToast: ToastData = useToast();
    const portfolio: React.RefObject<OverlayPanel | null> = useRef<OverlayPanel>(null);

    const [photos, setPhotos] = useState<Photo[]>([]);
    const [ratingThreshold, setRatingThreshold] = useState<PhotoRating>(5);
    const availableRatings: number[] = [0, 1, 2, 3, 4, 5];

    const onError: (message: string) => void = useEffectEvent((message: string): void => {
        showToast(MessageSeverity.ERROR, message);
    });

    useEffect((): void => {
        apiClient(`portfolio/${ratingThreshold}`)
            .then((res: Response): Promise<Photo[]> => res.json())
            .then((data: Photo[]): void => setPhotos(data))
            .catch((err: Error): void => {
                onError("Failed to fetch portfolio");
                console.log(err);
            });
    }, [ratingThreshold]);

    return (
        <div>
            <Button type="button"
                    className="nav-button"
                    icon="pi pi-image"
                    label="Portfolio"
                    style={{marginBottom: "1rem"}}
                    onClick={(e): void | undefined => portfolio.current?.toggle(e)}
            />
            <OverlayPanel ref={portfolio}
                          style={{maxWidth: "70%"}}>
                <div id="rating-container">
                    <div>
                        Rating threshold:
                        <Dropdown value={ratingThreshold}
                                  style={{marginLeft: "0.5rem"}}
                                  onChange={(e: DropdownChangeEvent): void => {
                                      setRatingThreshold(e.target.value);
                                  }}
                                  options={availableRatings}/>
                    </div>

                    <PortfolioDownload ratingThreshold={ratingThreshold}/>
                </div>

                <PhotoTable photos={photos}
                            emptyMessage={"No rated photos, go rate some!"}/>
            </OverlayPanel>
        </div>
    );
}

