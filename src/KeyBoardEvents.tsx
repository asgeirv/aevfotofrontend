import {type KeyboardEventHandler, useEffect} from "react";

export function useGlobalKeydown(handler: KeyboardEventHandler) {

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // @ts-ignore
            handler(event);
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handler]);
}