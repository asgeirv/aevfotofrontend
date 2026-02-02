import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {useState} from "react";
import {Button} from "primereact/button";
import * as React from "react";
import {useGlobalKeydown} from "../KeyBoardEvents.tsx";

interface LoginViewProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export function LoginView({setIsLoggedIn}: LoginViewProps) {
    const [user, setUser] = useState<string>("")

    function login() {
        setIsLoggedIn(true);
    }

    useGlobalKeydown((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            login();
        }
    })

    function footer() {
        return (<Button label={"Login"}
                        icon={"pi pi-sign-in"}
                        onClick={login}
                        className="full-width"/>)
    }

    return (
        <div className="login-container">
            <Card title="Login"
                  footer={footer}>
                <div className="login-form">
                    <FloatLabel>
                        <InputText id="username"
                                   className="full-width"
                                   placeholder="Username"
                                   value={user}
                                   onChange={(e) => setUser(e.target.value)}/>
                        <label htmlFor="username">Username</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="password"
                                   className="full-width"
                                   type="password"
                                   placeholder="Password"/>
                        <label htmlFor="password">Password</label>
                    </FloatLabel>
                </div>
            </Card>
        </div>
    )
}