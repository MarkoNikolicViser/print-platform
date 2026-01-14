
import * as React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Divider,
    Stack,
} from '@mui/material';

type PaperSize = 'a4' | 'a3' | 'a5';
type ColorOption = 'bw' | 'color';
type BindingOption = 'none' | 'staple' | 'spiral';

export interface SelectedOptions {
    paper_size: PaperSize;
    color: ColorOption;
    binding: BindingOption;
    doubleSided: boolean;
    copies: number;
}

export interface OrderItem {
    id: number;
    documentId: string;
    selected_options: SelectedOptions;
    quantity: number;
    unit_price: number;
    total_price: number;
    document_url: string;
    document_name: string;
    document_pages: number;
    document_mime: string;
    status_code: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string | null;
    locale?: string | null;
}

interface OrderItemsEditorProps {
    items: OrderItem[];
    /**
     * Called when user clicks "Sačuvaj izmene".
     * Receives the updated items array (including selected_options and total_price).
     */
    onSave?: (updated: OrderItem[]) => void;
    /**
     * Optional price function: compute total_price based on business rules.
     * If omitted, existing item.total_price is preserved.
     */
    priceFn?: (item: OrderItem) => number;
    /**
     * Optional: called on every change for live integrations.
     */
    onChange?: (updated: OrderItem[]) => void;
}

const currencyFmt = new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 2,
});
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

export const OrderItemsEditor: React.FC<OrderItemsEditorProps> = ({
    // items,
    onSave,
    priceFn,
    onChange,
}) => {
    const [edited, setEdited] = React.useState<OrderItem[]>(() => structuredClone(items));
    const [dirty, setDirty] = React.useState(false);

    // Recompute totals if a priceFn is provided
    const withComputedTotals = React.useMemo(() => {
        if (!priceFn) return edited;
        return edited.map((it) => ({
            ...it,
            total_price: priceFn(it),
        }));
    }, [edited, priceFn]);

    const grandTotal = React.useMemo(
        () => withComputedTotals.reduce((acc, it) => acc + Number(it.total_price || 0), 0),
        [withComputedTotals]
    );

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

    const handleCopiesChange = (itemId: number, raw: string) => {
        // Ensure integer >= 1
        const parsed = Math.max(1, Math.floor(Number(raw) || 1));
        handleOptionChange(itemId, 'copies', parsed);
    };

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

    return (
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
                {withComputedTotals.map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            {/* Header / info */}
                            <Grid item xs={12} md={4}>
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
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id={`ps-${item.id}`}>Format papira</InputLabel>
                                            <Select
                                                labelId={`ps-${item.id}`}
                                                label="Format papira"
                                                value={item.selected_options.paper_size}
                                                onChange={(e) =>
                                                    handleOptionChange(item.id, 'paper_size', e.target.value as PaperSize)
                                                }
                                            >
                                                <MenuItem value="a4">A4</MenuItem>
                                                <MenuItem value="a3">A3</MenuItem>
                                                <MenuItem value="a5">A5</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id={`clr-${item.id}`}>Štampa</InputLabel>
                                            <Select
                                                labelId={`clr-${item.id}`}
                                                label="Štampa"
                                                value={item.selected_options.color}
                                                onChange={(e) =>
                                                    handleOptionChange(item.id, 'color', e.target.value as ColorOption)
                                                }
                                            >
                                                <MenuItem value="bw">Crno-belo</MenuItem>
                                                <MenuItem value="color">U boji</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id={`bind-${item.id}`}>Povez</InputLabel>
                                            <Select
                                                labelId={`bind-${item.id}`}
                                                label="Povez"
                                                value={item.selected_options.binding}
                                                onChange={(e) =>
                                                    handleOptionChange(item.id, 'binding', e.target.value as BindingOption)
                                                }
                                            >
                                                <MenuItem value="none">Bez poveza</MenuItem>
                                                <MenuItem value="staple">Spajalica</MenuItem>
                                                <MenuItem value="spiral">Spiralni</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={item.selected_options.doubleSided}
                                                    onChange={(e) =>
                                                        handleOptionChange(item.id, 'doubleSided', e.target.checked)
                                                    }
                                                />
                                            }
                                            label="Obostrano"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            label="Primeraka"
                                            type="number"
                                            size="small"
                                            inputProps={{ min: 1, step: 1 }}
                                            value={item.selected_options.copies}
                                            onChange={(e) => handleCopiesChange(item.id, e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
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
                    <Typography variant="h6">{currencyFmt.format(grandTotal)}</Typography>
                </Stack>
            </Paper>
        </Box>
    );
};
