import {type Context, createContext, useContext} from "react";

export type ToastSeverity = "success" | "info" | "warn" | "error" | "secondary" | "contrast" | undefined;

export type ToastContextType = (severity: ToastSeverity, message: string) => void;

export const ToastContext: Context<ToastContextType | undefined> = createContext<ToastContextType | undefined>(undefined);

export function useToast(): (severity: ToastSeverity, message: string) => void {
    const toastContextType: ((severity: ToastSeverity, message: string) => void) | undefined = useContext(ToastContext);

    if (toastContextType === undefined) {
        throw new Error("useToast() must be used within a ToastContext");
    }
    return toastContextType;
}