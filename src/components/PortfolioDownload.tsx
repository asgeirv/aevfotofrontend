import {type ReactElement, useContext, useState} from "react";
import {apiClient} from "../utils/apiClient.tsx";
import {ToastContext, type ToastContextType} from "../context/ToastContext.tsx";
import {Button} from "primereact/button";

interface PortfolioDownloadProps {
    ratingThreshold: number
}

export function PortfolioDownload({ratingThreshold}: PortfolioDownloadProps): ReactElement {
    const [isPreparingDownload, setPreparingDownload] = useState<boolean>(false);

    const showToast: ToastContextType | undefined = useContext(ToastContext);

    function downloadPortfolio(): void {
        setPreparingDownload(true);
        showToast?.("info", "Downloading portfolio")
        apiClient(`portfolio/dl/${ratingThreshold}`)
            .then((res: Response): Promise<Blob> => res.blob())
            .then((blob: Blob): void => {
                const fileUrl: string = URL.createObjectURL(blob);
                const link: HTMLAnchorElement = document.createElement("a");
                link.href = fileUrl;
                link.download = "portfolio.zip";
                link.click();
                link.parentNode?.removeChild(link);
                setPreparingDownload(false);
            })
            .catch((err: Error): void => {
                showToast?.("error", "Failed to download portfolio");
                console.log(err);
                setPreparingDownload(false);
            })
    }

    return (
        <>
            <Button type="button"
                    icon={isPreparingDownload ? "pi pi-spin pi-spinner" : "pi pi-download"}
                    disabled={isPreparingDownload}
                    onClick={downloadPortfolio}
                    tooltip="Download"
                    tooltipOptions={{position: "top"}}/>
        </>
    )
}