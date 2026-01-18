"use client";

import { IconButton, Chip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface CartButtonProps {
    quantity: number;
    onClick?: () => void;
}

export default function CartButton({ quantity, onClick }: CartButtonProps) {
    return (
        <IconButton
            color="primary"
            onClick={onClick}
            sx={{ position: "relative" }}
            disabled={!quantity || quantity < 1}
        >
            <ShoppingCartIcon />
            {/* Chip overlay for quantity */}
            {quantity > 0 && (
                <Chip
                    label={quantity}
                    color="secondary"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        fontWeight: "bold",
                        height: 20,
                    }}
                />
            )}
        </IconButton>
    );
}