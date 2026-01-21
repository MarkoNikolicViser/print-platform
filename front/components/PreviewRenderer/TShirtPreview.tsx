import { PreviewProps } from "../../types";

export default function TShirtPreview({ fileUrl }: PreviewProps) {
    return (
        <div className="relative w-[300px] mx-auto">
            <img
                src="/mockups/tshirt-white.png"
                alt="T-shirt"
                className="w-full"
            />

            <img
                src={fileUrl}
                alt="Print"
                className="absolute top-[30%] left-[30%] w-[40%]"
            />
        </div>
    );
}
