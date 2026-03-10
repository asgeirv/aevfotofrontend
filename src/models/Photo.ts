export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type PhotoRating = 0 | 1 | 2 | 3 | 4 | 5;

export type Photo = {
    id: number;
    year: number;
    month: Month;
    subfolder: string | undefined;
    filename: string;
    rating: PhotoRating;
    flaggedForDeletion: boolean;
}