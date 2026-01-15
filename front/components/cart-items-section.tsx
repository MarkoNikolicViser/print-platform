'use client';

import React, { useEffect, useState } from 'react';
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
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useOrderItems } from '../hooks/useOrderItems'
import { OrderItemsSkeleton } from './ui/OrderItemsSkeleton';
import ErrorState from './ui/error-state';
import { OrderItemsEditor } from '../components/uiTestCartComponent'
import { renderOptionField } from '../components/ui/DynamicRenderOfFields'
type CartItem = {
    id: number;
    file_name: string;
    pages: number;
    copies: number;
    color: string;
    binding: string;
    price: number;
};
const items =
    [
        {
            id: 10,
            documentId: 'mpj6xhvt865sev2fmzxdp7ik',
            selected_options: { paper_size: 'a4', color: 'bw', binding: 'none', doubleSided: true, copies: 1 },
            quantity: 1,
            unit_price: 10,
            total_price: 10,
            document_url: '/test.pdf',
            document_name: 'test',
            document_pages: 3,
            document_mime: 'application/pdf',
            status_code: 'pending',
            createdAt: '2026-01-14T20:37:36.589Z',
            updatedAt: '2026-01-14T20:37:36.589Z',
            publishedAt: '2026-01-14T20:37:36.590Z',
            locale: null,
        },
        {
            id: 11,
            documentId: 'mpj6xhvt865sev2fmzxdp7ik',
            selected_options: { paper_size: 'a4', color: 'bw', binding: 'none', doubleSided: true, copies: 1 },
            quantity: 1,
            unit_price: 10,
            total_price: 10,
            document_url: '/test.pdf',
            document_name: 'test',
            document_pages: 3,
            document_mime: 'application/pdf',
            status_code: 'pending',
            createdAt: '2026-01-14T20:37:36.589Z',
            updatedAt: '2026-01-14T20:37:36.589Z',
            publishedAt: '2026-01-14T20:37:36.590Z',
            locale: null,
        },
        // ...the rest of your items
    ];

export default function CartItemsSection() {
    const [orderId, setOrderId] = useState<string | undefined>(undefined)
    const { data: orderItems, isLoading, isError, error } = useOrderItems(orderId)

    const [edited, setEdited] = React.useState<OrderItem[]>(() => structuredClone(items));
    const [dirty, setDirty] = React.useState(false);

    // Recompute totals if a priceFn is provided
    const withComputedTotals = React.useMemo(() => {
        // if (!priceFn) return edited;
        return edited.map((it) => ({
            ...it,
            total_price: 0,
        }));
    }, [edited]);

    const grandTotal = React.useMemo(
        () => withComputedTotals.reduce((acc, it) => acc + Number(it.total_price || 0), 0),
        [withComputedTotals]
    );
    const currencyFmt = new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
        minimumFractionDigits: 2,
    });
    const handleOptionChange = <K extends keyof SelectedOptions>(
        itemId: number,
        key: K,
        value: SelectedOptions[K]
    ) => {
        setEdited((prev) =>
            prev.map((it) =>
                it.id === itemId
                    ? {
                        ...it,
                        selected_options: {
                            ...it.selected_options,
                            [key]: value,
                        },
                    }
                    : it
            )
        );
        setDirty(true);
    };

    // const handleCopiesChange = (itemId: number, raw: string) => {
    //     // Ensure integer >= 1
    //     const parsed = Math.max(1, Math.floor(Number(raw) || 1));
    //     handleOptionChange(itemId, 'copies', parsed);
    // };

    const resetChanges = () => {
        setEdited(structuredClone(items));
        setDirty(false);
        onChange?.(items);
    };

    const saveChanges = () => {
        const payload = withComputedTotals;
        onSave?.(payload);
        setDirty(false);
    };

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
    if (isLoading || !orderId) return <OrderItemsSkeleton />;
    if (isError) return <ErrorState queryKey={["order-items"]} message={error.message} />;

    return (
        <Box maxWidth="md" mx="auto" mt={4} px={2}>
            <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5">Stavke narudžbine</Typography>
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={resetChanges} disabled={!dirty}>
                            Poništi izmene
                        </Button>
                        <Button variant="contained" onClick={saveChanges} disabled={!dirty}>
                            Sačuvaj izmene
                        </Button>
                    </Stack>
                </Stack>

                <Stack spacing={2}>
                    {orderItems?.items?.map((item) => (
                        <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                {/* Header / info */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {item.document_name} ({item.document_pages} str.)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {item.documentId} • MIME: {item.document_mime}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Jedinična cena: <b>{currencyFmt.format(Number(item.unit_price))}</b>
                                    </Typography>
                                    <Typography variant="body2">
                                        Ukupno za ovu stavku:{' '}
                                        <b>{currencyFmt.format(Number(item.total_price))}</b>
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Status: {item.status_code}
                                    </Typography>
                                </Grid>

                                {/* Editors */}
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Grid container spacing={2}>
                                        {Object.entries(item.allowed_options).map(([key, option]) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={key}>
                                                {renderOptionField(
                                                    item,
                                                    key as keyof SelectedOptions,
                                                    option as AllowedOption
                                                )}
                                            </Grid>
                                        ))}
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" color="text.secondary">
                                Napomena: Izmena opcija ne menja cenu osim ako obezbedite <code>priceFn</code>.
                            </Typography>
                        </Paper>
                    ))}
                </Stack>

                <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>Ukupan iznos</Typography>
                        <Typography variant="h6">{currencyFmt.format(orderItems?.total)}</Typography>
                    </Stack>
                </Paper>
            </Box>

            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button onClick={() => router.push('/checkout')} variant="contained" size="large">
                    Proceed to Checkout
                </Button>
            </Box>
        </Box>
    )
}
