import {type Context, createContext} from "react";

export type ToastSeverity = "success" | "info" | "warn" | "error" | "secondary" | "contrast" | undefined;

export type ToastContextType = (severity: ToastSeverity, message: string) => void;


export const ToastContext: Context<ToastContextType | null> = createContext<ToastContextType | null>(null);