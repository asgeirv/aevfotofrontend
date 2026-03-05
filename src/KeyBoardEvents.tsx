import {type KeyboardEventHandler, useEffect} from "react";

export function useGlobalKeydown(handler: KeyboardEventHandler): void {

    useEffect((): () => void => {
        const handleKeyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent): void => {
            // @ts-ignore
            handler(event);
        };

        document.addEventListener('keydown', handleKeyDown);

        return (): void => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handler]);
}