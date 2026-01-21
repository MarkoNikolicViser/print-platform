import { PreviewProps } from "../../types";

export default function MugPreview({ fileUrl }: PreviewProps) {
    return (
        <div className="relative w-[300px] mx-auto">
            <img
                src="/mockups/mug.png"
                alt="Mug"
                className="w-full"
            />

            <img
                src={fileUrl}
                alt="Print"
                className="absolute top-[35%] left-[25%] w-[50%] opacity-90"
            />
        </div>
    );
}
