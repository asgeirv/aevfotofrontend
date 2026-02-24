import {isTokenValid} from "./jwtValidation";
import type {Photo} from "../models/Photo.ts";
import type {PhotoData} from "../models/PhotoData.ts";

const baseUrl: string = "http://localhost:8080/api/";

export const apiClient: (endpoint: string, options?: RequestInit) => Promise<Response> = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
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

    const response: Response = await fetch(baseUrl + endpoint, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    return response;
};

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

export const fetchPhotosData: (photos: Photo[], thumbs?: boolean) => Promise<PhotoData[]> = async (photos: Photo[], thumbs: boolean = false): Promise<PhotoData[]> => {
    const dataList: PhotoData[] = [];

    photos.forEach((photo: Photo): void => {
        fetchPhotoData(photo.id, thumbs)
            .then((data: PhotoData) => {
                dataList.push(data)
                console.log(dataList.length)
            });

    });

    return dataList;
}