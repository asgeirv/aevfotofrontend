import {useState} from "react";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import * as React from "react";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void> = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        console.log(JSON.stringify({username, password}));

        try {
            const response: Response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password})
            });

            const json = await response.json();

            if (response.ok) {
                console.log("Login successful!", json);
                localStorage.setItem("token", json.token);
                navigate("/app");
            } else {
                setError(json.message || "Invalid username or password");
            }
        } catch (err) {
            setError("Something went wrong during login");
            console.error("Login error: " + err);
        } finally {
            setIsLoading(false);
        }
    }

    function footer() {
        return (<Button label={isLoading ? "Logging in..." : "Login"}
                        icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                        className="full-width"
                        type="submit"
                        disabled={isLoading}/>)
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <Card title="Do the login stuff"
                      footer={footer}>
                    {error && <div className="error-message">
                        <i className="pi pi-exclamation-triangle" style={{marginRight: "0.5rem"}}/> {error}
                    </div>}

                    <div className="login-form">
                        <FloatLabel>
                            <InputText id="username"
                                       className="full-width"
                                       placeholder="Username"
                                       value={username}
                                       onChange={(e) => setUsername(e.target.value)}/>
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
    );
}