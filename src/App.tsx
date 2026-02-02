import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primeicons/primeicons.css';
import {NavView} from "./components/NavView.tsx";
import {useState} from "react";
import {LoginView} from "./components/LoginView.tsx";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return (
        <div className="root">
            <div className="app-container">
                {isLoggedIn ? <NavView/> : <LoginView setIsLoggedIn={setIsLoggedIn}/>}
            </div>
        </div>
    );
}

export default App
