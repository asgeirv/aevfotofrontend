import {Navigate} from 'react-router-dom';
import * as React from "react";

// Definitely not AI generated
interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const isAuthenticated: () => boolean = (): boolean => {
        // Check if user has a valid token
        const token: string | null = localStorage.getItem('token');
        return !!token;

        // Optional: You can add token validation here
        // For example, check if token is expired
    };

    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
}
