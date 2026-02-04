"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import PreviewRenderer from "./PreviewRenderer";
import { PrintType } from "../../types";

interface PreviewModalProps {
    open: boolean;
    onClose: () => void;
    printType: PrintType | string;
    fileUrl: string;
}

export default function PreviewModal({
    open,
    onClose,
    printType,
    fileUrl,
}: PreviewModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle
                sx={{ display: "flex", justifyContent: "space-between" }}
            >
                Preview fajla
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        minHeight: 400,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <PreviewRenderer
                        printType={printType}
                        fileUrl={fileUrl}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
}
