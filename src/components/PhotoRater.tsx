import * as React from "react";
import {type ReactElement} from "react";
import {Rating, type RatingChangeEvent} from "primereact/rating";
import type {Photo, PhotoRating} from "../models/Photo.ts";
import type {Nullable} from "primereact/ts-helpers";
import {MessageSeverity} from "primereact/api";
import {useToast} from "../context/ToastContext.tsx";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";

interface PhotoRatingProps {
    photo: Photo;
    readOnly: boolean;
    updatePhoto: (photo: Photo) => void;
}

export function PhotoRater({photo, readOnly, updatePhoto}: PhotoRatingProps): ReactElement {
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

    function onKeyDown(e: React.KeyboardEvent): void {
        switch (e.key) {
            case "0":
                    updateRating(photo, 0);
                break;
            case "1":
                    updateRating(photo, 1);
                break;
            case "2":
                    updateRating(photo, 2);
                break;
            case "3":
                    updateRating(photo, 3);
                break;
            case "4":
                    updateRating(photo, 4);
                break;
            case "5":
                    updateRating(photo, 5);
                break;
        }
    }

    useGlobalKeydown((e: React.KeyboardEvent): void => {
        onKeyDown(e);
    })

    return (
        <>
            <Rating value={photo.rating}
                    onChange={(e: RatingChangeEvent): void => updateRating(photo, e.value)}
                    readOnly={readOnly}/>
        </>
    )
}