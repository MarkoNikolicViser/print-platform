import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slider,
    Stack,
    Typography,
} from '@mui/material';

interface ImageCropperDialogProps {
    open: boolean;
    image: string; // URL ili objectURL
    aspect?: number;
    onComplete: (file: File) => void;
    onClose: () => void;
}

export const ImageCropperDialog: React.FC<ImageCropperDialogProps> = ({
    open,
    image,
    aspect = 1,
    onComplete,
    onClose,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback(
        (_: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        const file = await getCroppedImg(image, croppedAreaPixels, rotation);
        onComplete(file);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogContent dividers>
                <div style={{ position: 'relative', width: '100%', height: 400, background: '#333' }}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                    />
                </div>

                <Stack spacing={2} mt={2}>
                    <Typography variant="body2">Zoom</Typography>
                    <Slider
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(_, value) => setZoom(value as number)}
                    />

                    <Typography variant="body2">Rotation</Typography>
                    <Slider
                        min={0}
                        max={360}
                        step={1}
                        value={rotation}
                        onChange={(_, value) => setRotation(value as number)}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// -----------------------------
// Helper funkcije (canvas → File)
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas context not available');

    const radians = (rotation * Math.PI) / 180;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.translate(-pixelCrop.x, -pixelCrop.y);
    ctx.translate(image.width / 2, image.height / 2);
    ctx.rotate(radians);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(image, 0, 0);

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) return;
            resolve(new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.95);
    });
}
