import {Image} from "primereact/image";
import {Card} from 'primereact/card';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import {Rating} from 'primereact/rating';
import {FloatLabel} from 'primereact/floatlabel';
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import 'primeicons/primeicons.css';

import {useEffect, useState} from 'react';

interface YearPickerProps {
    years: string[];
    selectedYear: string | undefined;
    setYear: (year: string) => void;
}

interface MonthPickerProps {
    months: string[];
    selectedMonth: string | undefined;
    setMonth: (month: string) => void;
}

interface SubfolderPickerProps {
    subfolders: string[];
    selectedSubfolder: string | undefined;
    setSubfolder: (subfolder: string) => void;
}

interface PhotoViewProps {
    year: string | undefined;
    month: string | undefined;
    subfolder: string;
}

function App() {
    const [years, setYears] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>();
    useEffect(() => {
        fetch('http://localhost:8080/api/photos')
            .then(res => res.json())
            .then(data => setYears(data))
            .catch(err => {
                setYears([]);
                console.error(err)
            })
    }, []);

    const [months, setMonths] = useState<string[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>();
    useEffect(() => {
        fetch(`http://localhost:8080/api/photos/${selectedYear}`)
            .then(res => res.json())
            .then(data => setMonths(data))
            .catch(err => {
                setMonths([]);
                console.error(err);
            });
    });

    const [subfolders, setSubfolders] = useState<string[]>([]);
    const [subfolder, setSubfolder] = useState<string>("");
    useEffect(() => {
        if (selectedMonth) {
            fetch(`http://localhost:8080/api/photos/${selectedYear}/${selectedMonth}/folders`)
                .then(res => res.json())
                .then(data => setSubfolders(data))
                .catch(err => {
                    setSubfolders([]);
                    console.error(err);
                });
        }
    });

    return (
        <div className="root">
            <div id="date-nav-container">
                <Card>
                    <YearPicker years={years}
                                selectedYear={selectedYear}
                                setYear={newYear => {
                                    setSelectedYear(newYear);
                                    setSubfolder("");
                                    if (months.length === 0) {
                                        setSelectedMonth(undefined);
                                    }
                                }}/>
                    <MonthPicker months={months}
                                 selectedMonth={selectedMonth}
                                 setMonth={newMonth => {
                                     setSelectedMonth(newMonth);
                                     if (subfolders.length === 0) {
                                         setSubfolder("");
                                     }
                                 }}/>
                    <SubfolderPicker subfolders={subfolders}
                                     selectedSubfolder={selectedYear}
                                     setSubfolder={newSubfolder => setSubfolder(newSubfolder)}/>
                </Card>
            </div>
            <PhotoView year={selectedYear}
                       month={selectedMonth}
                       subfolder={subfolder}/>
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
    if (!selectedMonth) {
        setMonth(months[0]);
    }

    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="month-picker"
                          disabled={months.length === 0}
                          value={selectedMonth}
                          onChange={e => setMonth(e.target.value)}
                          options={months}
                          placeholder={selectedMonth}/>
                <label htmlFor="month-picker">Month</label>
            </FloatLabel>
        </div>
    )
}

function SubfolderPicker({subfolders, selectedSubfolder, setSubfolder}: SubfolderPickerProps) {
    return (
        <div className="datepicker-container">
            <FloatLabel>
                <Dropdown inputId="subfolder-picker"
                          disabled={subfolders.length === 0}
                          value={selectedSubfolder}
                          onChange={e => setSubfolder(e.target.value)}
                          options={subfolders}
                          placeholder={selectedSubfolder}/>
                <label htmlFor="subfolder-picker">Subfolder</label>
            </FloatLabel>
        </div>
    );
}

function PhotoView({year, month, subfolder}: PhotoViewProps) {
    const [photoIds, setPhotoIds] = useState<number[]>();
    const [currentPhoto, setCurrentPhoto] = useState<number>(0);
    let url: string;
    if (month) {
        url = `http://localhost:8080/api/photos/${year}/${month}`;
    }
    if (subfolder) {
        url = `http://localhost:8080/api/photos/${year}/${month}/${subfolder}`;
    }
    useEffect(() => {
        if (month) {
            fetch(url)
                .then(res => res.json())
                .then(data => setPhotoIds(data))
                .catch(err => console.log(err));
        }
    });

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
                {photoIds === undefined || photoIds.length === 0 ? (
                    <p>No photos found!</p>
                ) : (
                    <>
                        <p>{currentPhoto + 1}/{photoIds.length}</p>
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
                )}
            </Card>
        </div>
    )
}

export default App

