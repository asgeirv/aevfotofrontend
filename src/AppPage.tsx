import {Card} from "primereact/card";
import {PortfolioView} from "./components/PortfolioView.tsx";
import {DeletionView} from "./components/DeletionView.tsx";
import {YearPicker} from "./components/YearPicker.tsx";
import {MonthPicker} from "./components/MonthPicker.tsx";
import {SubfolderPicker} from "./components/SubfolderPicker.tsx";
import {PhotoView} from "./components/PhotoView.tsx";
import {type ReactElement, type RefObject, useEffect, useRef, useState} from "react";
import type {Photo} from "./models/Photo.ts";
import {type AuthStuff, useAuth} from "./hooks/useAuth.tsx";
import {Button} from "primereact/button";
import {apiClient} from "./utils/apiClient.tsx";
import {Toast} from "primereact/toast";
import {ToastContext, type ToastSeverity} from "./ToastContext.tsx";

export default function AppPage(): ReactElement {
    const authStuff: AuthStuff = useAuth();
    const toast: RefObject<Toast | null> = useRef(null);
    const [selectedYear, setSelectedYear] = useState<number>();
    const [years, setYears] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>();
    const [months, setMonths] = useState<number[]>([]);
    const [selectedSubfolder, setSelectedSubfolder] = useState<string | undefined>(undefined);
    const [subfolders, setSubfolders] = useState<string[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [deletedPhotos, setDeletedPhotos] = useState<Photo[]>([]);

    const showToast: (severity: ToastSeverity, message: string) => void = (severity: ToastSeverity, message: string): void => {
        toast.current?.show({severity: severity, detail: message});
    }

    useEffect((): void => {
        apiClient("years")
            .then((res: Response): Promise<number[]> => res.json())
            .then((data: number[]): void => setYears(data))
            .catch(err => {
                showToast("error", "Error getting years");
                console.error(err);
            });
    }, []);

    useEffect((): void => {
        if (selectedYear) {
            apiClient(`${selectedYear}`)
                .then((res: Response): Promise<number[]> => res.json())
                .then((data: number[]): void => setMonths(data))
                .catch(err => {
                    showToast("error", `Error getting months for $${selectedYear}`);
                    console.error(err);
                });
        }
    }, [selectedYear]);

    useEffect((): void => {
        if (selectedYear && selectedMonth) {
            apiClient(`${selectedYear}/${selectedMonth}/subfolders`)
                .then((res: Response): Promise<string[]> => res.json())
                .then((data: string[]): void => setSubfolders(data))
                .catch(err => {
                    showToast("error", `Error getting subfolders for ${selectedYear}/${selectedMonth}`);
                    console.error(err);
                });
        }
    }, [selectedYear, selectedMonth]);

    useEffect((): void => {
        if (selectedYear && selectedMonth && selectedSubfolder) {
            apiClient(`photos/${selectedYear}/${selectedMonth}/${selectedSubfolder}`)
                .then((res: Response): Promise<Photo[]> => res.json())
                .then((data: Photo[]): void => setPhotos(data))
                .catch(err => {
                    showToast("error", `Error getting photos for ${selectedYear}/${selectedMonth}/${selectedSubfolder}`);
                    console.error(err);
                });
        } else if (selectedYear && selectedMonth) {
            apiClient(`photos/${selectedYear}/${selectedMonth}`)
                .then((res: Response): Promise<Photo[]> => res.json())
                .then((data: Photo[]): void => setPhotos(data))
                .catch(err => {
                    showToast("error", `Error getting photos for ${selectedYear}/${selectedMonth}`);
                    console.error(err);
                });
        }
    }, [selectedYear, selectedMonth, selectedSubfolder]);

    useEffect((): void => {
        apiClient("photos/deleted")
            .then((res: Response): Promise<Photo[]> => res.json())
            .then((data: Photo[]): void => setDeletedPhotos(data))
            .catch((err): void => {
                showToast("error", "Error getting photos flagged for deletion")
                console.log(err);
            });
    }, [deletedPhotos]);

    return (
        <ToastContext value={showToast}>
            <div className="app-container">
                <Toast ref={toast}/>

                <div className="nav">
                    <Card id="buttons"
                          className="photo-handling-card">
                        <div className="photo-handling">
                            <div className="nav-buttons">
                                <PortfolioView/>
                                <DeletionView photos={deletedPhotos}
                                              setPhotos={setDeletedPhotos}/>
                            </div>

                            <div className="logout-button">
                                <Button icon="pi pi-sign-out"
                                        onClick={(): void => authStuff.logout()}/>
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
        </ToastContext>
    )
}