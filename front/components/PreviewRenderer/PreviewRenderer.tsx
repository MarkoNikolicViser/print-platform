"use client";

import {
    PdfPreview,
    ImagePreview,
    MugPreview,
    TShirtPreview,
} from "../PreviewRenderer";

import { PrintType, PreviewProps } from "../../types";

interface PreviewRendererProps extends PreviewProps {
    printType: PrintType | string;
}

const PREVIEW_MAP: Record<PrintType | string, React.FC<PreviewProps>> = {
    'application/pdf': PdfPreview,
    'image/png': ImagePreview,
    'image/jpeg': ImagePreview,
    mug: MugPreview,
    tshirt: TShirtPreview,
};

export default function PreviewRenderer({
    printType,
    fileUrl,
}: PreviewRendererProps) {
    const Component = PREVIEW_MAP[printType];

    if (!Component) {
        return (
            <div className="text-sm text-gray-500">
                Preview not available for this print type
            </div>
        );
    }

    return <Component fileUrl={fileUrl} />;
}
