import {jwtDecode} from "jwt-decode";

export interface JwtPayload {
    exp: number;
    iat?: number;
    sub?: string;
    role?: string;
}

const isTokenExpired: (token: string) => boolean = (token: string): boolean => {
    try {
        const currentTime: number = Date.now();
        const expirationTime = getTokenExpirationTime(token);
        if (!expirationTime) {
            return true;
        }
        return expirationTime < currentTime;
    } catch (error) {
        console.error(error);
        return true;
    }
};

export const isTokenValid: (token: (string | null)) => boolean = (token: string | null): boolean => {
    if (!token) return false;

    try {
        return !isTokenExpired(token)
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getTokenPayload: (token: string) => (JwtPayload | null) = (token: string): JwtPayload | null => {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getTokenExpirationTime: (token: string) => (number | null) = (token: string): number | null => {
    try {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        return decoded.exp * 1000;
    } catch (error) {
        console.error(error);
        return null;
    }
};