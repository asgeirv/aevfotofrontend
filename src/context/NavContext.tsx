import {type Context, createContext, useContext} from "react";

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type NavData = {
    year: number | undefined;
    setYear: (year: number) => void;
    month: Month | undefined;
    setMonth: (month: Month) => void;
    subfolder: string | undefined;
    setSubfolder: (subfolder: string | undefined) => void;
}

export const NavContext: Context<NavData | undefined> = createContext<NavData | undefined>(undefined);

export function useNavContext(): NavData {
    const navData: NavData | undefined = useContext(NavContext);

    if (navData === undefined) {
        throw new Error("useNavContext must be used within a NavContext");
    }

    return navData;
}