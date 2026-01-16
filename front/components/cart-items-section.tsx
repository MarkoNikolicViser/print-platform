
'use client';

import React from 'react';
import {
    Box, Typography, Grid, Divider, Button, Stack, Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useOrderItems } from '../hooks/useOrderItems';
import { OrderItemsSkeleton } from './ui/OrderItemsSkeleton';
import ErrorState from './ui/error-state';
import { renderOptionField } from '../components/ui/DynamicRenderOfFields';
import { OrderItem, SelectedOptions, AllowedOption } from '@/types';
import { useDirtyCart } from '../hooks/useDirtyCart';

export default function CartItemsSection() {
    const router = useRouter();
    const [orderId, setOrderId] = React.useState<string | undefined>(undefined);

    const { data: orderItems, isLoading, isError, error } = useOrderItems(orderId);

    // keep a local editable copy sourced from server data
    const serverItems = React.useMemo(
        () => (orderItems?.items as OrderItem[]) ?? [],
        [orderItems]
    );
    const [edited, setEdited] = React.useState<OrderItem[]>([]);

    // Init edited when serverItems arrive
    React.useEffect(() => {
        if (serverItems.length > 0) {
            setEdited(structuredClone(serverItems));
        }
    }, [serverItems]);

    // Dirty/patch tracking
    const { dirty, patch, changed, reset } = useDirtyCart(serverItems, edited);

    // Currency formatter (RSD)
    const currencyFmt = React.useMemo(() => new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
        minimumFractionDigits: 2,
    }), []);

    const handleOptionChange = <K extends keyof SelectedOptions>(
        itemId: number,
        key: K,
        value: SelectedOptions[K]
    ) => {
        setEdited(prev =>
            prev.map(it =>
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
    };

    const handleQuantityChange = (itemId: number, newQty: number) => {
        if (newQty < 1) return;
        setEdited(prev =>
            prev.map(it => (it.id === itemId ? { ...it, quantity: newQty } : it))
        );
    };

    const handleRemove = (id: number) => {
        setEdited(prev => prev.filter(it => it.id !== id));
    };

    const resetChanges = () => {
        // discard edits and go back to latest server snapshot
        setEdited(structuredClone(serverItems));
        // Also accepts server snapshot as clean
        reset();
    };

    const saveChanges = async () => {
        if (!dirty) return;

        // Example: your API can accept update/remove/add in one go,
        // or you may need to call separate endpoints.
        // Replace this with your mutations:
        // await api.patchCart(orderId!, patch);

        console.log('PATCH payload', patch);

        // After successful save, accept current as clean
        reset();
    };

    React.useEffect(() => {
        if (error?.status === 410) {
            router.push('/');
        }
    }, [isError, error, router]);

    React.useEffect(() => {
        const stored = localStorage.getItem('order_code');
        if (stored) setOrderId(String(stored));
    }, []);

    if (isLoading || !orderId) return <OrderItemsSkeleton />;
    if (isError) return <ErrorState queryKey={['order-items']} message={error.message} />;

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

                {/* show what changed (optional) */}
                {dirty && changed.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Izmenjeno: {changed.join(', ')}
                    </Typography>
                )}

                <Stack spacing={2}>
                    {edited.map((item) => (
                        <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                {/* Header / info */}
                                <Grid size={{ xs: 12, md: 4 }} >
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
                                        Ukupno za ovu stavku: <b>{currencyFmt.format(Number(item.total_price))}</b>
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Status: {item.status_code}
                                    </Typography>

                                    {/* Quantity (example) */}
                                    {/* You can replace with your MUI numeric control */}
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                        >
                                            −
                                        </Button>
                                        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                                            Količina: {item.quantity}
                                        </Typography>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemove(item.id)}
                                            sx={{ ml: 'auto' }}
                                        >
                                            Ukloni
                                        </Button>
                                    </Stack>
                                </Grid>

                                {/* Editors */}
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Grid container spacing={2}>
                                        {Object.entries(item.allowed_options || {}).map(([key, option]) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={key}>
                                                {renderOptionField(
                                                    item,
                                                    key as keyof SelectedOptions,
                                                    option as AllowedOption,
                                                    handleOptionChange
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
                        <Typography variant="h6">{currencyFmt.format(Number(orderItems?.total ?? 0))}</Typography>
                    </Stack>
                </Paper>
            </Box>

            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button onClick={() => router.push('/checkout')} variant="contained" size="large">
                    Proceed to Checkout
                </Button>
            </Box>
        </Box>
    );
}
