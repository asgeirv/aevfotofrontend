import {Card} from 'primereact/card';
import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primeicons/primeicons.css';

import {useEffect, useState} from 'react';
import {YearPicker} from "./components/YearPicker.tsx";
import {MonthPicker} from "./components/MonthPicker.tsx";
import {SubfolderPicker} from "./components/SubfolderPicker.tsx";
import {PhotoView} from "./components/PhotoView.tsx";
import {PortfolioView} from "./components/PortfolioView.tsx";
import type {Year} from "./models/Year.ts";
import type {Subfolder} from "./models/Subfolder.ts";
import type {Month} from "./models/Month.ts";
import {DeletionView} from "./components/DeletionView.tsx";

function App() {
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
        <div className="root">
            <div className="app-container">
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
            </div>
        </div>
    );
}

export default App
