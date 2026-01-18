
import * as React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { OrderItem, AllowedOption, SelectedOptions } from '@/types';

export const renderOptionField = (
    item: OrderItem,
    optionKey: keyof SelectedOptions,
    option: AllowedOption,
    handleOptionChange: <K extends keyof SelectedOptions>(
        itemId: number,
        key: K,
        value: SelectedOptions[K]
    ) => void
) => {
    const value = item.selected_options[optionKey];

    switch (option.type) {
        case 'select':
            return (
                <FormControl fullWidth size="small">
                    <InputLabel>{option.label}</InputLabel>
                    <Select
                        label={option.label}
                        value={value ?? ''}
                        onChange={(e) =>
                            handleOptionChange(item.id, optionKey, e.target.value as any)
                        }
                    >
                        {option.options?.map((opt) => (
                            <MenuItem key={String(opt.value)} value={String(opt.value)}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );

        case 'radio':
            return (
                <FormControl component="fieldset">
                    <Typography variant="caption" sx={{ mb: 0.5 }}>
                        {option.label}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {option.options?.map((opt) => (
                            <FormControlLabel
                                key={String(opt.value)}
                                control={
                                    <Switch
                                        checked={value === opt.value}
                                        onChange={() =>
                                            handleOptionChange(item.id, optionKey, opt.value as any)
                                        }
                                    />
                                }
                                label={opt.label}
                            />
                        ))}
                    </Stack>
                </FormControl>
            );

        case 'number':
            return (
                <TextField
                    label={option.label}
                    type="number"
                    size="small"
                    value={Number(value ?? option.min ?? 1)}
                    inputProps={{
                        min: option.min,
                        max: option.max,
                        step: 1,
                    }}
                    onChange={(e) =>
                        handleOptionChange(
                            item.id,
                            optionKey,
                            Math.max(option.min ?? 1, Number(e.target.value)) as any
                        )
                    }
                    fullWidth
                />
            );

        default:
            return null;
    }
};
