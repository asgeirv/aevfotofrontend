import {isTokenValid} from "./jwtValidation";
import type {PhotoData} from "../models/PhotoData.ts";

const baseUrl: string = "http://localhost:8080/api/";

export const apiClient: (endpoint: string, options?: RequestInit) => Promise<Response> = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const accessToken: string | null = localStorage.getItem("accessToken");

    if (!isTokenValid(accessToken)) {
        localStorage.removeItem("accessToken");
        await refreshToken();
    }

    let response: Response = await callApi(endpoint, accessToken, options);

    if (response.status === 401) {
        await refreshToken();
        response = await callApi(endpoint, accessToken, options);
    }

    return response;
};

async function callApi(endpoint: string, token: string | null, options?: RequestInit): Promise<Response> {
    const headers = {
        "Content-Type": "application/json",
        ...(token && {"Authorization": `Bearer ${token}`}),
        ...(options && options.headers),
    };

    return fetch(baseUrl + endpoint, {
        ...options,
        headers
    });
}

export async function refreshToken(): Promise<void> {
    localStorage.removeItem("accessToken");
    const refreshToken: string | null = localStorage.getItem("refreshToken");

    if (!isTokenValid(refreshToken)) {
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        throw new Error("Token expired");
    }

    const response: Response = await callApi("user/refresh", refreshToken, {
        method: "POST",
        body: JSON.stringify({"token": refreshToken})
    });

    if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        throw new Error("Unauthorized");
    } else {
        const json = await response.json();
        localStorage.setItem("accessToken", json.accessToken);
        localStorage.setItem("refreshToken", json.refreshToken);
    }
}

export const signOut: () => Promise<void> = async (): Promise<void> => {
    await apiClient("user/logout", {
        method: "POST",
        body: JSON.stringify({"token": localStorage.getItem("refreshToken")})
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

export const fetchPhotoData: (id: number, thumb?: boolean) => Promise<PhotoData> = async (id: number, thumb: boolean = false): Promise<PhotoData> => {
    return apiClient(`photo/${id}/${thumb ? "thumbnail" : ""}`, {})
        .then((res: Response): Promise<string> => res.text())
        .then((data: string | null): PhotoData => {
            if (data) {
                return {id: id, data: `data:image/jpg;base64,${data}`}
            } else {
                return {id: id, data: undefined};
            }
        })
        .catch((err: Error): PhotoData => {
            console.log(err);
            return {id: id, data: undefined};
        });
}

