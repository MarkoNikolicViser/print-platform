'use client';

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import { Plus, Trash } from 'lucide-react';

type Range = {
  from: number;
  to: number;
  price: number;
};

type RangePricing = {
  [valueKey: string]: {
    ranges: Range[];
  };
};

interface Props {
  optionKey: string;
  label: string;
  options: { value: any; label: string }[];
  value: RangePricing;
  onChange: (next: RangePricing) => void;
}

export function RangePricingEditor({ optionKey, label, options, value, onChange }: Props) {
  const updateRange = (valueKey: string, index: number, field: keyof Range, newValue: number) => {
    const next = structuredClone(value);
    next[valueKey].ranges[index][field] = newValue;
    onChange(next);
  };

  const addRange = (valueKey: string) => {
    const next = structuredClone(value);
    next[valueKey].ranges.push({ from: 1, to: 1, price: 0 });
    onChange(next);
  };

  const removeRange = (valueKey: string, index: number) => {
    const next = structuredClone(value);
    next[valueKey].ranges.splice(index, 1);
    onChange(next);
  };

  return (
    <Card>
      <CardHeader title={label} />
      <CardContent>
        <Stack spacing={4}>
          {options.map((opt) => {
            const key = String(opt.value);
            const ranges = value?.[key]?.ranges ?? [];

            return (
              <Box key={key}>
                <Typography fontWeight="bold" mb={1}>
                  {opt.label}
                </Typography>

                <Stack spacing={2}>
                  {ranges.map((range, idx) => (
                    <Stack key={idx} direction="row" spacing={2} alignItems="center">
                      <TextField
                        label="Od"
                        type="number"
                        size="small"
                        value={range.from}
                        onChange={(e) => updateRange(key, idx, 'from', Number(e.target.value))}
                      />
                      <TextField
                        label="Do"
                        type="number"
                        size="small"
                        value={range.to}
                        onChange={(e) => updateRange(key, idx, 'to', Number(e.target.value))}
                      />
                      <TextField
                        label="Cena (RSD)"
                        type="number"
                        size="small"
                        value={range.price}
                        onChange={(e) => updateRange(key, idx, 'price', Number(e.target.value))}
                      />
                      <IconButton color="error" onClick={() => removeRange(key, idx)}>
                        <Trash size={16} />
                      </IconButton>
                    </Stack>
                  ))}

                  <Button size="small" startIcon={<Plus size={14} />} onClick={() => addRange(key)}>
                    Dodaj opseg
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
