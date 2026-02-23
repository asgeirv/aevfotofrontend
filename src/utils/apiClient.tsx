import {isTokenValid} from "./jwtValidation";

export const apiClient: (url: string, options?: RequestInit) => Promise<Response> = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token: string | null = localStorage.getItem("token");

    if (!isTokenValid(token)) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Token expired");
    }

    const headers = {
        "Content-Type": "application/json",
        ...(token && {"Authorization": `Bearer ${token}`}),
        ...options.headers,
    };

    const response: Response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    return response;
};
