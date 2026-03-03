import {useEffect, useState} from "react";
import {getTokenPayload, isTokenValid, type JwtPayload} from "../utils/jwtValidation";
import {signOut} from "../utils/apiClient.tsx";

export type AuthStuff = {
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    getUsername: () => (string | null);
    getRole: () => (string | null);
    canWrite: () => boolean;
}

export const useAuth: () => AuthStuff = (): AuthStuff => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect((): void => {
        const checkAuth: () => void = (): void => {
            const token: string | null = localStorage.getItem("accessToken");
            setIsAuthenticated(isTokenValid(token));
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const logout: () => void = (): void => {
        signOut()
            .then((): void => {
                setIsAuthenticated(false);
                window.location.href = "/login";
            });
    };

    const getUsername: () => (string | null) = (): string | null => {
        const token: string | null = localStorage.getItem("accessToken");
        if (!isTokenValid(token)) {
            return null;
        }

        const payload: JwtPayload | null = getTokenPayload(token);
        return payload?.sub || null;
    };

    const getRole: () => string | null = (): string | null => {
        const token: string | null = localStorage.getItem("accessToken");
        if (!isTokenValid(token)) {
            return null;
        }

        const payload: JwtPayload | null = getTokenPayload(token);
        return payload?.role || null;
    }

    const canWrite: () => boolean = (): boolean => {
        const token: string | null = localStorage.getItem("accessToken");
        if (!isTokenValid(token)) {
            return false;
        }

        return getRole() === "ADMIN" || getRole() === "READ_WRITE";
    }

    return {
        isAuthenticated,
        isLoading,
        logout,
        getUsername: getUsername,
        getRole: getRole,
        canWrite: canWrite
    };
};