import * as React from "react";
import {type ReactElement} from "react";
import {Button} from "primereact/button";
import type {Photo} from "../models/Photo.ts";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";

interface NextUnratedButtonProps {
    photos: Photo[];
    currentId: number;
    setCurrentId: (id: number) => void;
}

export function NextUnratedButton({photos, currentId, setCurrentId}: NextUnratedButtonProps): ReactElement {

    const findNextUnrated: () => void = (): void => {
        for (let i: number = currentId + 1; i < photos.length; i++) {
            if (photos[i].rating === 0) {
                setCurrentId(i);
                return;
            }
        }
    }

    function onKeyDown(e: React.KeyboardEvent): void {
        switch (e.key) {
            case "n":
                findNextUnrated();
                break;
        }
    }

    useGlobalKeydown((e: React.KeyboardEvent): void => {
        onKeyDown(e);
    })

    return (
        <>
            <Button icon="pi pi-forward"
                    onClick={findNextUnrated}
                    tooltip="Next unrated photo (N)"
                    tooltipOptions={{position: "bottom"}}/>
        </>
    )
}