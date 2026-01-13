import {Image} from "primereact/image";
import {Card} from 'primereact/card';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import {Rating} from 'primereact/rating';
import {FloatLabel} from 'primereact/floatlabel';
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import 'primeicons/primeicons.css';

import {useState, useEffect} from 'react';
import type {Photo} from "./models/Photo.ts";


function App() {
    return (
        <div className="root">
            <div id="date-nav-container">
                <Card>
                    <div className="datepicker-container">
                        <FloatLabel>
                            <Dropdown inputId="year-picker"/>
                            <label htmlFor="year-picker">Year</label>
                        </FloatLabel>
                    </div>
                    <div className="datepicker-container">
                        <FloatLabel>
                            <Dropdown inputId="month-picker"/>
                            <label htmlFor="month-picker">Month</label>
                        </FloatLabel>
                    </div>
                    <div className="datepicker-container">
                        <FloatLabel>
                            <Dropdown inputId="subfolder-picker"/>
                            <label htmlFor="subfolder-picker">Subfolder</label>
                        </FloatLabel>
                    </div>
                </Card>
            </div>
            <PhotoView/>
        </div>
    );
}

function PhotoView() {
    const [photoIds, setPhotoIds] = useState<number[]>();
    useEffect(() => {
        fetch('http://localhost:8080/api/photos')
            .then(res => res.json())
            .then(data => setPhotoIds(data))
            .catch(err => console.log(err));
    })
    const [currentPhoto, setCurrentPhoto] = useState<number>(0);

    function previousPhoto() {
        if (currentPhoto === 0) {
            setCurrentPhoto(photoIds?.length - 1);
        } else {
            setCurrentPhoto(currentPhoto - 1);
        }
    }

    function nextPhoto() {
        if (currentPhoto === photoIds?.length - 1) {
            setCurrentPhoto(0);
        } else {
            setCurrentPhoto(currentPhoto + 1);
        }
    }

    function deletePhoto() {

    }

    return (
        <div id="image-container">
            <Card>
                {photoIds === undefined ? (
                    <p>No photos found!</p>
                ) : (
                    <>
                        <p>{currentPhoto + 1}/{photoIds.length}</p>
                        <Image src={"http://localhost:8080/api/photos/" + photoIds[currentPhoto]} width="100%"/>
                        <div id="photo-nav-container">
                            <Button icon="pi pi-arrow-left"
                                    onClick={previousPhoto}/>

                            <Rating/>

                            <Button icon="pi pi-arrow-right"
                                    onClick={nextPhoto}/>
                        </div>
                        <div id="photo-del-container">
                            <Button icon="pi pi-trash"
                                    severity="danger"
                                    onClick={deletePhoto}/>
                        </div>
                    </>
                )}
            </Card>
        </div>
    )
}

export default App

