'use client';

import {
  Box,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useProductTemplates } from '@/hooks/useProductTemplates';
import { useUpsertProductPricing } from '@/hooks/useUpsertProductPricing';
import { PricingTemplateSelector } from '../ui/PricingTemplateSelector';
import { RangePricingEditor } from '../ui/RangePricingEditor';

/* ---------------- TYPES ---------------- */

type PricingValues = {
  [optionKey: string]: any;
};

/* ---------------- HELPERS ---------------- */

function buildInitialPricing(template: TemplateWithPricing): PricingValues {
  const result: PricingValues = {};
  const existing = template.pricing?.option_price_modifiers || {};

  Object.entries(template.allowed_options).forEach(
    ([optionKey, option]: any) => {
      if (option.pricing_type === 'range') {
        result[optionKey] = existing[optionKey] ?? {};

        option.options.forEach((opt: any) => {
          const valKey = String(opt.value);

          if (!result[optionKey][valKey]) {
            result[optionKey][valKey] = { ranges: [] };
          }
        });
      } else {
        result[optionKey] = {
          values: {
            ...(existing[optionKey]?.values ?? {}),
          },
        };

        option.options.forEach((opt: any) => {
          const valKey = String(opt.value);
          if (result[optionKey].values[valKey] === undefined) {
            result[optionKey].values[valKey] = 0;
          }
        });
      }
    },
  );

  return result;
}

/* ---------------- COMPONENT ---------------- */

export function PricingSettings() {
  const { data: templates = [], isLoading } = useProductTemplates();
  const { mutate: savePricing, isLoading: isSaving } =
    useUpsertProductPricing();

  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateWithPricing | null>(null);

  const [pricing, setPricing] = useState<PricingValues>({});
  const [basePrice, setBasePrice] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [hasChanges, setHasChanges] = useState(false);

  /* ---------------- INIT ON TEMPLATE SELECT ---------------- */

  useEffect(() => {
    if (!selectedTemplate) return;

    setBasePrice(selectedTemplate.pricing?.base_price ?? 0);
    setIsActive(selectedTemplate.pricing?.is_active ?? true);

    const initialPricing = buildInitialPricing(selectedTemplate);
    setPricing(initialPricing);

    setHasChanges(false);
  }, [selectedTemplate]);

  /* ---------------- UPDATE HANDLERS ---------------- */

  const updatePrice = (
    optionKey: string,
    valueKey: string,
    value: number,
  ) => {
    setPricing((prev) => ({
      ...prev,
      [optionKey]: {
        values: {
          ...prev[optionKey].values,
          [valueKey]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const updateRangePricing = (
    optionKey: string,
    nextValue: any,
  ) => {
    setPricing((prev) => ({
      ...prev,
      [optionKey]: nextValue,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!selectedTemplate) return;

    savePricing({
      product_template: selectedTemplate.id,
      base_price: basePrice,
      option_price_modifiers: pricing,
      is_active: isActive,
    });

    setHasChanges(false);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* HEADER */}
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Cenovnik proizvoda
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Kreiranje i uređivanje cena po templejtima
        </Typography>
      </Box>

      {/* TEMPLATE SELECTOR */}
      <PricingTemplateSelector
        templates={templates}
        selectedTemplate={selectedTemplate}
        isLoading={isLoading}
        onSelect={setSelectedTemplate}
      />

      {/* BASE PRICE + ACTIVE TOGGLE */}
      {selectedTemplate && (
        <Card>
          <CardHeader
            title="Osnovna cena"
            action={
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => {
                      setIsActive(e.target.checked);
                      setHasChanges(true);
                    }}
                    color="success"
                  />
                }
                label={isActive ? 'Aktivan' : 'Neaktivan'}
              />
            }
          />
          <CardContent>
            <TextField
              label="Base price (RSD)"
              type="number"
              value={basePrice}
              onChange={(e) => {
                setBasePrice(Number(e.target.value));
                setHasChanges(true);
              }}
              fullWidth
              inputProps={{ min: 0 }}
              disabled={!isActive}
            />
          </CardContent>
        </Card>
      )}

      {/* OPTION PRICING */}
      {selectedTemplate &&
        Object.entries(selectedTemplate.allowed_options).map(
          ([optionKey, option]: any) => {
            if (option.pricing_type === 'range') {
              return (
                <RangePricingEditor
                  key={optionKey}
                  optionKey={optionKey}
                  label={option.label}
                  options={option.options}
                  value={pricing[optionKey]}
                  onChange={(next) =>
                    updateRangePricing(optionKey, next)
                  }
                />
              );
            }

            return (
              <Card key={optionKey}>
                <CardHeader title={option.label} />
                <CardContent>
                  <Grid container spacing={2}>
                    {option.options.map((opt: any) => (
                      <Grid item xs={12} md={6} key={String(opt.value)}>
                        <TextField
                          label={`${opt.label} (RSD)`}
                          type="number"
                          value={
                            pricing?.[optionKey]?.values?.[
                            String(opt.value)
                            ] ?? 0
                          }
                          onChange={(e) =>
                            updatePrice(
                              optionKey,
                              String(opt.value),
                              Number(e.target.value),
                            )
                          }
                          fullWidth
                          inputProps={{ min: 0 }}
                          disabled={!isActive}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            );
          },
        )}

      {/* SAVE */}
      {selectedTemplate && (
        <Box>
          <Button
            variant="contained"
            startIcon={<Save size={16} />}
            disabled={!hasChanges || isSaving}
            onClick={handleSave}
          >
            {selectedTemplate.has_pricing
              ? 'Sačuvaj izmene'
              : 'Kreiraj cenovnik'}
          </Button>
        </Box>
      )}
    </Box>
  );
}