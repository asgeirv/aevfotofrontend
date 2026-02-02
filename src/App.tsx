import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primeicons/primeicons.css';
import {Dashboard} from "./components/Dashboard.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LoginView} from "./components/LoginView.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";

function App() {
    return (
        <AuthProvider>
            <div className="root">
                <div className="app-container">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginView />}/>

                            <Route path="/dashboard"
                                   element={
                                       <ProtectedRoute>
                                           <Dashboard />
                                       </ProtectedRoute>
                                   }/>
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;
