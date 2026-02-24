import {Card} from "primereact/card";
import {PortfolioView} from "./components/PortfolioView.tsx";
import {DeletionView} from "./components/DeletionView.tsx";
import {YearPicker} from "./components/YearPicker.tsx";
import {MonthPicker} from "./components/MonthPicker.tsx";
import {SubfolderPicker} from "./components/SubfolderPicker.tsx";
import {PhotoView} from "./components/PhotoView.tsx";
import {useEffect, useState} from "react";
import type {Photo} from "./models/Photo.ts";
import {type AuthStuff, useAuth} from "./hooks/useAuth.tsx";
import {Button} from "primereact/button";
import {apiClient} from "./utils/apiClient.tsx";

export default function AppPage() {
    const authStuff: AuthStuff = useAuth();
    const [selectedYear, setSelectedYear] = useState<number>();
    const [years, setYears] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>();
    const [months, setMonths] = useState<number[]>([]);
    const [selectedSubfolder, setSelectedSubfolder] = useState<string | undefined>(undefined);
    const [subfolders, setSubfolders] = useState<string[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        apiClient("years")
            .then(res => res.json())
            .then(data => setYears(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedYear) {
            apiClient(`${selectedYear}`)
                .then(res => res.json())
                .then(data => setMonths(data))
                .catch(err => console.error(err));
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedYear && selectedMonth) {
            apiClient(`${selectedYear}/${selectedMonth}/subfolders`)
                .then(res => res.json())
                .then(data => setSubfolders(data))
                .catch(err => console.error(err));
        }
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        if (selectedYear && selectedMonth && selectedSubfolder) {
            apiClient(`photos/${selectedYear}/${selectedMonth}/${selectedSubfolder}`)
                .then(res => res.json())
                .then(data => setPhotos(data))
                .catch(err => console.error(err));
        } else if (selectedYear && selectedMonth) {
            apiClient(`photos/${selectedYear}/${selectedMonth}`)
                .then(res => res.json())
                .then(data => setPhotos(data))
                .catch(err => console.error(err));
        }
    }, [selectedYear, selectedMonth, selectedSubfolder]);


    if (!authStuff.isAuthenticated) {
        return (
            <div className="app-container">Please do the login stuff</div>
        )
    }

    return (
        <div className="app-container">
            <div className="nav">
                <Card id="buttons"
                      className="photo-handling-card">
                    <div className="photo-handling">
                        <div className="nav-buttons">
                            <PortfolioView/>
                            <DeletionView/>
                        </div>

                        <div className="logout-button">
                            <Button icon="pi pi-sign-out"
                            onClick={() => authStuff.logout()}/>
                        </div>
                    </div>
                </Card>

                <Card id="dropdowns"
                      className="photo-handling-card">
                    <div className="date-nav">
                        <YearPicker years={years}
                                    selectedYear={selectedYear}
                                    setYear={setSelectedYear}/>

                        <MonthPicker months={months}
                                     selectedMonth={selectedMonth}
                                     setMonth={setSelectedMonth}/>

                        <SubfolderPicker subfolders={subfolders}
                                         selectedSubfolder={selectedSubfolder}
                                         setSelectedSubfolder={setSelectedSubfolder}/>
                    </div>
                </Card>
            </div>

            <PhotoView photos={photos}/>
        </div>
    )
}