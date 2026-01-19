export type Photo = {
    id: number;
    year: number;
    month: string;
    subfolder: string;
    filename: string;
    rating: number;
    flaggedForDeletion: boolean;
}