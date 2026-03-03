import {Navigate} from "react-router-dom";
import * as React from "react";
import {isTokenValid} from '../utils/jwtValidation';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const token: string | null = localStorage.getItem("accessToken");

    if (!isTokenValid(token)) {
        console.log("Invalid token!")
        localStorage.removeItem("token");
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
}
