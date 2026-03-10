import * as React from "react";
import {type ReactElement} from "react";
import {Rating, type RatingChangeEvent} from "primereact/rating";
import type {Photo, PhotoRating} from "../models/Photo.ts";
import type {Nullable} from "primereact/ts-helpers";
import {MessageSeverity} from "primereact/api";
import {useToast} from "../context/ToastContext.tsx";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";
import {Button} from "primereact/button";

interface PhotoRatingProps {
    photos: Photo[];
    currentId: number;
    setCurrentId: (id: number) => void;
    readOnly: boolean;
    updatePhoto: (photo: Photo) => void;
}

export function PhotoRater({photos, currentId, setCurrentId, readOnly, updatePhoto}: PhotoRatingProps): ReactElement {
    const showToast: ((severity: MessageSeverity, message: string) => void) = useToast();

    function updateRating(photo: Photo, rating: Nullable<number>): void {
        if (rating === undefined) {
            showToast(MessageSeverity.ERROR, "Undefined rating")

            console.error("Undefined rating!");
            return;
        } else if (rating === null) {
            photo.rating = 0;
        } else if (rating < 0 || rating > 5) {
            showToast(MessageSeverity.ERROR, "Invalid rating")

            console.error("Invalid rating!");
            return;
        } else {
            photo.rating = rating as PhotoRating;
        }

        updatePhoto(photo);
    }

    const findNextUnrated: () => void = (): void => {
        for (let i: number = currentId + 1; i < photos.length; i++) {
            if (photos[i].rating === 0) {
                setCurrentId(i);
                return;
            }
        }
    }

    const findPreviousUnrated: () => void = (): void => {
        for (let i: number = currentId - 1; i >= 0; i--) {
            if (photos[i].rating === 0) {
                setCurrentId(i);
                return;
            }
        }
    }

    function onKeyDown(e: React.KeyboardEvent): void {
        switch (e.key) {
            case "0":
                    updateRating(photos[currentId], 0);
                break;
            case "1":
                    updateRating(photos[currentId], 1);
                break;
            case "2":
                    updateRating(photos[currentId], 2);
                break;
            case "3":
                    updateRating(photos[currentId], 3);
                break;
            case "4":
                    updateRating(photos[currentId], 4);
                break;
            case "5":
                    updateRating(photos[currentId], 5);
                break;
            case "n":
                findNextUnrated();
                break;
        }
    }

    useGlobalKeydown((e: React.KeyboardEvent): void => {
        onKeyDown(e);
    })

    return (
        <div className="photo-rating-container">
            <Button icon="pi pi-backward"
                    text
                    onClick={findPreviousUnrated}
                    tooltip="Previous unrated photo (P)"
                    tooltipOptions={{position: "bottom"}}/>

            <Rating value={photos[currentId].rating}
                    onChange={(e: RatingChangeEvent): void => updateRating(photos[currentId], e.value)}
                    readOnly={readOnly}/>

            <Button icon="pi pi-forward"
                    text
                    onClick={findNextUnrated}
                    tooltip="Next unrated photo (N)"
                    tooltipOptions={{position: "bottom"}}/>
        </div>
    )
}