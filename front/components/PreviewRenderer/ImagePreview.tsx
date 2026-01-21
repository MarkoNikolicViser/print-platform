import { PreviewProps } from '../../types'

export default function ImagePreview({ fileUrl }: PreviewProps) {
    return (
        <div className="flex justify-center">
            <img
                src={fileUrl}
                alt="Image preview"
                className="max-h-[500px] max-w-full object-contain border rounded"
            />
        </div>
    );
}
