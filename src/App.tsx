import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primeicons/primeicons.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from "./LoginPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AppPage from "./AppPage.tsx";
import type {ReactElement} from "react";

function App(): ReactElement {

    return (
        <div className="wrapper">
            <BrowserRouter>
                <Routes>
                    <Route path="/login"
                           element={<LoginPage/>}
                    />

                    <Route path="/app"
                           element={
                               <ProtectedRoute>
                                   <AppPage/>
                               </ProtectedRoute>
                           }
                    />

                    <Route path="/"
                           element={<Navigate to={"/app"} replace/>}
                    />

                    <Route path="*"
                           element={<Navigate to="/app"/>}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App
