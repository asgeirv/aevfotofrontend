import {type Context, createContext, useContext} from "react";
import {MessageSeverity} from "primereact/api";

export type ToastStuff = (severity: MessageSeverity, message: string) => void;

export const ToastContext: Context<ToastStuff | undefined> = createContext<ToastStuff | undefined>(undefined);

export function useToast(): (severity: MessageSeverity, message: string) => void {
    const toastStuff: ((severity: MessageSeverity, message: string) => void) | undefined = useContext(ToastContext);

    if (toastStuff === undefined) {
        throw new Error("useToast() must be used within a ToastContext");
    }
    return toastStuff;
}