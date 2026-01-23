import type {Subfolder} from "./Subfolder.ts";
import type {Photo} from "./Photo.ts";

export type Month = {
    num: number;
    subfolders: Subfolder[];
    photos: Photo[];
}