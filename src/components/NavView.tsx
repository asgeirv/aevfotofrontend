import {Card} from "primereact/card";
import {PortfolioView} from "./PortfolioView.tsx";
import {DeletionView} from "./DeletionView.tsx";
import {useEffect, useState} from "react";
import type {Year} from "../models/Year.ts";
import type {Month} from "../models/Month.ts";
import type {Subfolder} from "../models/Subfolder.ts";
import {YearPicker} from "./YearPicker.tsx";
import {MonthPicker} from "./MonthPicker.tsx";
import {SubfolderPicker} from "./SubfolderPicker.tsx";
import {PhotoView} from "./PhotoView.tsx";

export function NavView() {
    const [selectedYear, setSelectedYear] = useState<Year>();
    const [years, setYears] = useState<Year[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<Month>();
    const [selectedSubfolder, setSelectedSubfolder] = useState<Subfolder | undefined>(undefined);

    useEffect(() => {
        fetch('http://localhost:8080/api/photos')
            .then(res => res.json())
            .then(data => {
                setYears(data);
                years.sort();
            })
            .catch(err => console.log(err))
    }, [years]);

    return (
        <>
            <div id="nav">
                <Card id="photo-handling-card">
                    <div id="photo-handling">
                        <PortfolioView/>
                        <DeletionView/>
                    </div>
                </Card>

                <Card id="date-nav">
                    <YearPicker years={years}
                                selectedYear={selectedYear}
                                setYear={setSelectedYear}/>

                    <MonthPicker months={selectedYear?.months}
                                 selectedMonth={selectedMonth}
                                 setMonth={setSelectedMonth}/>

                    <SubfolderPicker subfolders={selectedMonth?.subfolders}
                                     selectedSubfolder={selectedSubfolder}
                                     setSelectedSubfolder={setSelectedSubfolder}/>
                </Card>
            </div>

            <PhotoView photos={selectedSubfolder ? selectedSubfolder.photos : selectedMonth?.photos}/>
        </>
    )
}