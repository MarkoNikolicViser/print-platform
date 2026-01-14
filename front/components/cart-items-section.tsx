'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Divider,
    Button,
    Stack,
    IconButton,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { useOrderItems } from '../hooks/useOrderItems'
import ShopSelectionSkeleton from './ui/shop-selection-skeleton';
import ErrorState from './ui/error-state';


type CartItem = {
    id: number;
    file_name: string;
    pages: number;
    copies: number;
    color: string;
    binding: string;
    price: number;
};

const initialCart = {
    order_code: 'abc-123',
    status_code: 'draft',
    order_items: [
        {
            id: 1,
            file_name: 'seminarski-rad.pdf',
            pages: 45,
            copies: 2,
            color: 'bw',
            binding: 'spiral',
            price: 360,
        },
        {
            id: 2,
            file_name: 'prezentacija.pdf',
            pages: 12,
            copies: 1,
            color: 'color',
            binding: 'none',
            price: 360,
        },
    ] as CartItem[],
};

export default function CartItemsSection() {
    const [orderId, setOrderId] = useState<string | undefined>(undefined)
    const { data: orderItems, isLoading, isError, error } = useOrderItems(orderId)
    const [items, setItems] = useState<CartItem[]>(
        initialCart.order_items
    );
    const router = useRouter()
    useEffect(() => {
        const stored = localStorage.getItem("order_code")
        if (stored) {
            setOrderId(String(stored))
        }
    }, [])

    // 🧮 total calculation
    const totalPrice = items.reduce(
        (sum, item) => sum + item.price,
        0
    );

    // 🗑️ remove item
    const handleRemove = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));

        // 🔗 kasnije:
        // mutateRemoveItem({ itemId: id })
    };

    // 🔁 change copies
    const handleCopiesChange = (
        id: number,
        newCopies: number
    ) => {
        if (newCopies < 1) return;

        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        copies: newCopies,
                        price: Math.round(
                            (item.price / item.copies) * newCopies
                        ),
                    }
                    : item
            )
        );

        // 🔗 kasnije (debounce):
        // mutateUpdateCopies({ itemId: id, copies: newCopies })
    };
    if (isLoading) return <ShopSelectionSkeleton />
    if (isError) return <ErrorState queryKey={["copyShops"]} message={error.message} />;

    return (
        <Box maxWidth="md" mx="auto" mt={4} px={2}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>

            {/* <Stack spacing={2}>
        {items.map((item) => (
            <Card key={item.id} variant="outlined">
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }} >
                            <Typography variant="h6">
                                {item.file_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pages: {item.pages}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Color: {item.color} · Binding: {item.binding}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 6, md: 3 }}>
                            <TextField
                                label="Copies"
                                type="number"
                                size="small"
                                value={item.copies}
                                inputProps={{ min: 1 }}
                                onChange={(e) =>
                                    handleCopiesChange(
                                        item.id,
                                        Number(e.target.value)
                                    )
                                }
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 4, md: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {item.price} RSD
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 2, md: 2 }}>
                            <IconButton
                                color="error"
                                onClick={() => handleRemove(item.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        ))}
    </Stack> */}
            {orderItems ? <Box mt={2}>
                <Typography variant="body2">TO DO // create fields instead of this:</Typography>
                <pre>{JSON.stringify(orderItems, null, 2)}</pre>
            </Box> : null}
            <Divider sx={{ my: 3 }} />

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h5" fontWeight="bold">
                    {orderItems?.total} RSD
                </Typography>
            </Box>

            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button onClick={() => router.push('/checkout')} variant="contained" size="large">
                    Proceed to Checkout
                </Button>
            </Box>
        </Box>
    )
}
