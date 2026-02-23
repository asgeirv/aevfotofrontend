import {useState, useEffect} from "react";
import {isTokenValid, getTokenPayload, type JwtPayload} from "../utils/jwtValidation";

export type AuthStuff = {
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    getUsername: () => (string | null);
}

export const useAuth: () => AuthStuff = (): AuthStuff => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect((): void => {
        const checkAuth: () => void = () => {
            const token: string | null = localStorage.getItem("token");
            setIsAuthenticated(isTokenValid(token));
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const logout: () => void = (): void => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        window.location.href = "/login";
    };

    const getUsername: () => (string | null) = (): string | null => {
        const token: string | null = localStorage.getItem("token");
        if (!token) {
            return null;
        }
        const payload: JwtPayload | null = getTokenPayload(token);
        return payload?.sub || null;
    };

    return {
        isAuthenticated,
        isLoading,
        logout,
        getUsername: getUsername,
    };
};