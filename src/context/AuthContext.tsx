import {createContext, type JSX, useContext, useState} from "react";
import useToken from "../hooks/useToken.tsx";

type Credentials = {
    userName: string;
    password: string;
}

type AuthContextValues = {
    token: string;
    user: string | null;
    login: (credentials: Credentials) => Promise<string>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValues>(undefined);

export function AuthProvider({ children }: { children: JSX.Element }) {
    const {token, setToken, removeToken} = useToken();
    const [user, setUser] = useState<string | null>("");

    const login: (credentials: Credentials) => Promise<string> = async (credentials: Credentials) => {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        setToken(data.token);
        console.log(token);
        return data;
    }

    const logout: () => void = () => {
        removeToken();
        setUser(null);
    }

    const value = {token, user, login, logout, isAuthenticated: !!token};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}