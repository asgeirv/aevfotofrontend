import {Card} from 'primereact/card';
import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primeicons/primeicons.css';

import {useEffect, useState} from 'react';
import type {Photo} from './models/Photo.ts';
import {YearPicker} from "./components/YearPicker.tsx";
import {MonthPicker} from "./components/MonthPicker.tsx";
import {SubfolderPicker} from "./components/SubfolderPicker.tsx";
import {PhotoView} from "./components/PhotoView.tsx";

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
    years.sort();

    const allMonths: string[] = photos
        .filter(photo => photo.year === selectedYear)
        .map(photo => photo.month);
    const monthSet = new Set<string>(allMonths);
    const months: string[] = [...monthSet];
    months.sort();

    const allSubfolders: string[] = photos
        .filter(photo => photo.year === selectedYear && photo.month === selectedMonth && photo.subfolder)
        .map(photo => photo.subfolder);
    const subfolderSet = new Set<string>(allSubfolders);
    const subfolders: string[] = [...subfolderSet];
    subfolders.sort();

    let photosInFolder: Photo[];
    if (selectedSubfolder) {
        photosInFolder = photos
            .filter(photo => photo.year === selectedYear && photo.month === selectedMonth && photo.subfolder === selectedSubfolder);
    } else {
        photosInFolder = photos
            .filter(photo => photo.year === selectedYear && photo.month === selectedMonth);
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
            <PhotoView photos={photosInFolder}/>
        </div>
    );
}

export default App
