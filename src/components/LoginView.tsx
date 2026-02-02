import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {useState} from "react";
import {Button} from "primereact/button";
import {useAuth} from "../context/AuthContext.tsx";
import useToken from "../hooks/useToken.tsx";

export function LoginView() {
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const {login} = useAuth();
    const {setToken} = useToken();

    const handleLogin = async e => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await login({userName, password});
            setToken(response);
        } catch (err) {
            setError(err.message || "Error occurred during login");
        } finally {
            setLoading(false);
        }
    }

    function footer() {
        return (<Button label={loading ? "Logging in..." : "Login"}
                        icon={"pi pi-sign-in"}
                        className="full-width"
                        type="submit"
                        disabled={loading}/>)
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <Card title="Do the Login stuff"
                      footer={footer}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="login-form">
                        <FloatLabel>
                            <InputText id="username"
                                       className="full-width"
                                       placeholder="Username"
                                       value={userName}
                                       onChange={(e) => setUserName(e.target.value)}/>
                            <label htmlFor="username">Username</label>
                        </FloatLabel>

                        <FloatLabel>
                            <InputText id="password"
                                       className="full-width"
                                       type="password"
                                       placeholder="Password"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            <label htmlFor="password">Password</label>
                        </FloatLabel>
                    </div>
                </Card>
            </form>
        </div>
    )
}