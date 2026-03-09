import {Card} from "primereact/card";
import {PortfolioView} from "./components/PortfolioView.tsx";
import {DeletionView} from "./components/DeletionView.tsx";
import {PhotoView} from "./components/PhotoView.tsx";
import {type ReactElement, type RefObject, useRef, useState} from "react";
import {type AuthStuff, useAuth} from "./hooks/useAuth.tsx";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {ToastContext, type ToastSeverity} from "./context/ToastContext.tsx";
import {PhotoNav} from "./components/PhotoNav.tsx";
import {type Month, NavContext, type NavData} from "./context/NavContext.tsx";
import 'primeicons/primeicons.css';

export default function AppPage(): ReactElement {
    const authStuff: AuthStuff = useAuth();
    const toast: RefObject<Toast | null> = useRef(null);

    const showToast: (severity: ToastSeverity, message: string) => void = (severity: ToastSeverity, message: string): void => {
        toast.current?.show({severity: severity, detail: message});
    }
    return (
        <ToastContext value={showToast}>
            <NavContext value={CreateNavContext()}>
                <div className="app-container">
                    <Toast ref={toast}/>

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
                                            onClick={(): void => authStuff.logout()}/>
                                </div>
                            </div>
                        </Card>

                        <Card id="dropdowns"
                              className="photo-handling-card">
                            <PhotoNav/>
                        </Card>
                    </div>

                    <PhotoView/>
                </div>
            </NavContext>
        </ToastContext>
    )
}

const CreateNavContext: () => NavData = (): NavData => {
    const [year, setYear] = useState<number | undefined>(undefined);
    const [month, setMonth] = useState<Month | undefined>(undefined);
    const [subfolder, setSubfolder] = useState<string | undefined>(undefined);
    console.log("Creating nav context!")

    return {
        year,
        setYear,
        month,
        setMonth,
        subfolder,
        setSubfolder
    };
}