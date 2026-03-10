import {type ReactElement, useState} from "react";
import {apiClient} from "../utils/apiClient.tsx";
import {type ToastData, useToast} from "../context/ToastContext.tsx";
import {Button} from "primereact/button";
import {MessageSeverity} from "primereact/api";

interface PortfolioDownloadProps {
    ratingThreshold: number
}

export function PortfolioDownload({ratingThreshold}: PortfolioDownloadProps): ReactElement {
    const [isPreparingDownload, setPreparingDownload] = useState<boolean>(false);

    const showToast: ToastData = useToast();

    function downloadPortfolio(): void {
        setPreparingDownload(true);
        showToast(MessageSeverity.INFO, "Downloading portfolio")
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
                showToast(MessageSeverity.ERROR, "Failed to download portfolio");
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