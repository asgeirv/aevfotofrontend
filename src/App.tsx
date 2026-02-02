import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primeicons/primeicons.css';
import {NavView} from "./components/NavView.tsx";


function App() {
    return (
        <div className="root">
            <div className="app-container">
                <NavView/>
            </div>
        </div>
    );
}

export default App
