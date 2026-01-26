import {Button} from "primereact/button";
import {useEffect, useRef, useState} from "react";
import {OverlayPanel} from "primereact/overlaypanel";
import type {Photo} from "../models/Photo.ts";
import {PhotoTable} from "./PhotoTable.tsx";

export function DeletionView() {
    const deleted = useRef<OverlayPanel>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/photos/deleted`)
            .then((res) => res.json())
            .then(data => setPhotos(data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div>
            <Button type="button"
                    icon="pi pi-trash"
                    onClick={(e) => deleted.current?.toggle(e)}/>

            <OverlayPanel ref={deleted}>
                <PhotoTable photos={photos}
                            emptyMessage={"No photos flagged for deletion."}/>

                <Button type="button"
                        icon="pi pi-trash"
                        severity="danger"
                        size="large"
                        style={{width: "100%"}}/>
            </OverlayPanel>
        </div>
    )
}