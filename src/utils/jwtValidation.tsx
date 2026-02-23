import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
}

const isTokenExpired: (token: string) => boolean = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    const currentTime: number = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error(error);
    return true;
  }
};

export const isTokenValid: (token: (string | null)) => boolean = (token: string | null): boolean => {
  if (!token) return false;

  try {
    return isTokenExpired(token)
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

export const getTokenExpirationTime: (token: string) => (Date | null) = (token: string): Date | null => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error(error);
    return null;
  }
};