import {Image} from "primereact/image";
import {Card} from 'primereact/card';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import {Rating} from 'primereact/rating';
import {FloatLabel} from 'primereact/floatlabel';
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import 'primeicons/primeicons.css';

import {useEffect, useState} from 'react';
import type {Photo} from "./models/Photo.ts";

interface YearPickerProps {
    years: number[];
    selectedYear: number | undefined;
    setYear: (year: number) => void;
}

interface MonthPickerProps {
    months: string[];
    selectedMonth: string | undefined;
    setMonth: (month: string) => void;
}

interface SubfolderPickerProps {
    subfolders: string[];
    selectedSubfolder: string | undefined;
    setSelectedSubfolder: (subfolder: string) => void;
}

interface PhotoViewProps {
    photoIds: number[];
}

function App() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>();
    const [selectedMonth, setSelectedMonth] = useState<string>();
    const [selectedSubfolder, setSelectedSubfolder] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetch('http://localhost:8080/api/photos')
            .then(res => res.json())
            .then(data => setPhotos(data))
            .catch(err => {
                setPhotos([]);
                console.error(err)
            })
    }, []);

    const allYears: number[] = photos.map(photo => photo.year);
    const yearSet = new Set<number>(allYears);
    const years: number[] = [...yearSet]

    const allMonths: string[] = photos
        .filter(photo => photo.year === selectedYear)
        .map(photo => photo.month);
    const monthSet = new Set<string>(allMonths);
    const months: string[] = [...monthSet];

    const allSubfolders: string[] = photos
        .filter(photo => photo.year === selectedYear && photo.month === selectedMonth && photo.subfolder)
        .map(photo => photo.subfolder);
    const subfolderSet = new Set<string>(allSubfolders);
    const subfolders: string[] = [...subfolderSet];

    let photoIds;
    if (selectedSubfolder) {
        photoIds = photos
            .filter(photo => photo.year === selectedYear && photo.month === selectedMonth && photo.subfolder === selectedSubfolder)
            .map(photo => photo.id);
    } else {
        photoIds = photos
            .filter(photo => photo.year === selectedYear && photo.month === selectedMonth)
            .map(photo => photo.id);
    }

    return (
        <div className="root">
            <div id="date-nav-container">
                <Card>
                    <YearPicker years={years}
                                selectedYear={selectedYear}
                                setYear={newYear => {
                                    setSelectedYear(newYear);
                                    setSelectedSubfolder("");
                                    if (months.length === 0) {
                                        setSelectedMonth(undefined);
                                    }
                                }}/>
                    <MonthPicker months={months}
                                 selectedMonth={selectedMonth}
                                 setMonth={newMonth => {
                                     setSelectedMonth(newMonth);
                                     if (subfolders.length === 0) {
                                         setSelectedSubfolder("");
                                     }
                                 }}/>
                    <SubfolderPicker subfolders={subfolders}
                                     selectedSubfolder={selectedSubfolder}
                                     setSelectedSubfolder={newSubfolder => setSelectedSubfolder(newSubfolder)}/>
                </Card>
            </div>
            <PhotoView photoIds={photoIds}/>
        </div>
    );
}

function YearPicker({years, selectedYear, setYear}: YearPickerProps) {
    if (!selectedYear) {
        setYear(years[0]);
    }

    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="year-picker"
                          value={selectedYear}
                          onChange={e => setYear(e.target.value)}
                          options={years}/>
                <label htmlFor="year-picker">Year</label>
            </FloatLabel>
        </div>
    )
}

function MonthPicker({months, selectedMonth, setMonth}: MonthPickerProps) {
    const options: string[] = months ? months : [];
    const disabled: boolean = options.length === 0;

    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="month-picker"
                          disabled={disabled}
                          value={selectedMonth}
                          onChange={e => setMonth(e.target.value)}
                          options={months}
                          placeholder={selectedMonth}/>
                <label htmlFor="month-picker">Month</label>
            </FloatLabel>
        </div>
    )
}

function SubfolderPicker({subfolders, selectedSubfolder, setSelectedSubfolder}: SubfolderPickerProps) {
    const options: string[] = subfolders ? subfolders : [];
    const disabled: boolean = options.length === 0;

    if (subfolders[0]) {
        return (
            <div className="datepicker-container">
                <FloatLabel>
                    <Dropdown inputId="subfolder-picker"
                              disabled={disabled}
                              value={selectedSubfolder}
                              onChange={e => setSelectedSubfolder(e.target.value)}
                              options={subfolders}
                              placeholder={selectedSubfolder}/>
                    <label htmlFor="subfolder-picker">Subfolder</label>
                </FloatLabel>
            </div>
        );
    } else {
        return null;
    }
}

function PhotoView({photoIds}: PhotoViewProps) {
    const [currentPhoto, setCurrentPhoto] = useState<number>(0);
    if (currentPhoto > photoIds.length) {
        setCurrentPhoto(0);
    }
    const cardTitle = photoIds.length > 0 ? `Photo ${currentPhoto + 1} / ${photoIds.length}` : "No photos found!";

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
            <Card title={cardTitle}>
                <>
                    <Image src={"http://localhost:8080/api/photo/" + photoIds[currentPhoto]} width="100%"/>
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
            </Card>
        </div>
    )
}

export default App

