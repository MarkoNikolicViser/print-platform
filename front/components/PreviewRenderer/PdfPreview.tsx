"use client";

import { PreviewProps } from "../../types";

export default function PdfPreview({ fileUrl }: PreviewProps) {
    return (
        <iframe
            src={fileUrl}
            className="w-full h-[500px] border rounded"
            title="PDF preview"
        />
    );
}
