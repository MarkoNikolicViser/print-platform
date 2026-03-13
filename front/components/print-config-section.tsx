'use client';

import { usePrintContext } from '@/context/PrintContext';
import { useFileUpload } from '@/hooks/useFileUpload';
import {
  Card, CardHeader, CardContent, Typography, Grid,
  FormControl, InputLabel, Select, MenuItem, FormLabel,
  RadioGroup, FormControlLabel, Radio, Checkbox, Button,
  Box, useMediaQuery, useTheme, Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface OptionField {
  type: 'number' | 'select' | 'radio' | 'checkbox';
  default: any;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  label?: string;
}

// ✅ Ensure allowedOptions is typed correctly
interface Template {
  id: number;
  description?: string;
  is_disabled?: boolean;
  supported_mime?: string;
  allowedOptions: Record<string, OptionField>;
}

export function PrintConfigSection({ onNextStep }: { onNextStep?: () => void }) {
  const { t } = useTranslation();
  const { files, updateFileConfig } = usePrintContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { uploadFile } = useFileUpload();

  const [printConfig, setLocalPrintConfig] = useState<Record<string, any> | null>(null);

  const currentTemplate: Template | null =
    files.find(f => f.selectedTemplate)?.selectedTemplate ?? null;

  const isDisabledTemplate = currentTemplate?.is_disabled ?? false;

  useEffect(() => {
    if (!currentTemplate) return;
    const tempConfig = Object.keys(currentTemplate.allowedOptions || {}).reduce(
      (acc, key) => {
        acc[key] = currentTemplate.allowedOptions[key].default;
        return acc;
      },
      {} as Record<string, any>
    );
    setLocalPrintConfig(tempConfig);

    files.forEach(f => {
      if (f.selectedTemplate?.id === currentTemplate.id) {
        updateFileConfig(f.id, { printConfig: tempConfig });
      }
    });
  }, [currentTemplate?.id]);

  const updateConfig = (key: string, value: any) => {
    setLocalPrintConfig(prev => ({ ...prev, [key]: value }));
    files.forEach(f => {
      if (f.selectedTemplate?.id === currentTemplate?.id) {
        updateFileConfig(f.id, { printConfig: { ...f.printConfig, [key]: value } });
      }
    });
  };

  if (!currentTemplate) return null;

  return (
    <Card elevation={isMobile ? 4 : 0} sx={{ boxShadow: 'none' }}>
      <CardHeader
        title={
          <Typography variant="h6" color="primary" align="center" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
            {t('home.printConfig.title')}
          </Typography>
        }
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          opacity: isDisabledTemplate ? 0.6 : 1,
          pointerEvents: isDisabledTemplate ? 'none' : 'auto',
        }}
      >
        {isDisabledTemplate && (
          <Alert severity="warning">
            {t('home.printConfig.disabledTemplateAlert') ??
              'Ovaj template ne podržava sve izabrane fajlove. Možete obrisati fajlove koji nisu podržani ili ih dodati u korpu.'}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary">
          {currentTemplate.description}
        </Typography>

        {/* {currentTemplate.supported_mime && (
          <Typography variant="caption" color="text.secondary">
            {t('home.printConfig.supportedMime') ?? 'Supported file types'}:{' '}
            {JSON.parse(currentTemplate.supported_mime).join(', ')}
          </Typography>
        )} */}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>{t('home.printConfig.copies')}</InputLabel>
              <Select
                value={files[0]?.quantity ?? 1}
                label={t('home.printConfig.copies')}
                onChange={(e) =>
                  files.forEach(f =>
                    updateFileConfig(f.id, { quantity: Number(e.target.value) })
                  )
                }
              >
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {Object.entries(currentTemplate.allowedOptions).map(([key, field]) => (
            <Grid size={{ xs: 12, md: 6 }} key={key}>
              {field.type === 'select' && field.options && (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={printConfig?.[key] ?? field.default}
                    onChange={(e) => updateConfig(key, e.target.value)}
                    label={field.label}
                  >
                    {field.options.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {field.type === 'radio' && field.options && (
                <FormControl component="fieldset">
                  <FormLabel>{field.label}</FormLabel>
                  <RadioGroup
                    value={printConfig?.[key] ?? field.default}
                    onChange={(e) => updateConfig(key, e.target.value)}
                  >
                    {field.options.map((opt) => (
                      <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {field.type === 'checkbox' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!printConfig?.[key]}
                      onChange={(e) => updateConfig(key, e.target.checked)}
                    />
                  }
                  label={field.label}
                />
              )}
            </Grid>
          ))}
        </Grid>

        {files.length > 1 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 2 }}
          >
            *Opcije koje ovde zadate primenjuju se na sve uploadovane fajlove.
            Izmene za pojedinačne fajlove možete napraviti kasnije u korpi.
          </Typography>
        )}
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            disabled={!currentTemplate}
            onClick={() => onNextStep?.()}
          >
            {t('home.printConfig.nextStep')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}