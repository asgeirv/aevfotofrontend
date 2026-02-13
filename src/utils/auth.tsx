// utils/auth.ts
// Helper functions for authentication

export const setAuthToken: (token: string) => void = (token: string): void => {
    localStorage.setItem('token', token);
};

export const getAuthToken: () => (string | null) = (): string | null => {
    return localStorage.getItem('token');
};

export const removeAuthToken: () => void = (): void => {
    localStorage.removeItem('token');
};

export const isAuthenticated: () => boolean = (): boolean => {
    return !!getAuthToken();
};

export const logout: () => void = (): void => {
    removeAuthToken();
    window.location.href = '/login';
};

// Optional: Add token to API requests
export const getAuthHeaders: () => { "Content-Type": string } = () => {
    const token: string | null = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};
