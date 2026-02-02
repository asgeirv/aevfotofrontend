import * as React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "./context/AuthContext.tsx";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const {isAuthenticated} = useAuth();
    console.log(isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return children;
}