'use client';

import { usePrintContext } from '@/context/PrintContext';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { ImageCropperDialog } from './FileEditor/ImageCropperDialog';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'react-toastify';

interface OptionField {
  type: 'number' | 'select' | 'radio' | 'checkbox';
  default: any;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  label?: string;
}

export function PrintConfigSection() {
  const {
    file,
    selectedTemplate,
    printConfig,
    setPrintConfig,
    quantity,
    setQuantity,
    setFileInfo,
  } = usePrintContext();
  const { uploadFile, loading: uploading } = useFileUpload();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const updateConfig = (key: string, value: any) => {
    setPrintConfig((prev: any) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }
    const temp = Object?.keys(selectedTemplate?.allowedOptions)?.reduce(
      (acc, key) => {
        acc[key] = selectedTemplate?.allowedOptions[key]?.default;
        return acc;
      },
      {} as Record<string, any>,
    );
    setPrintConfig(temp);
  }, [selectedTemplate]);
  const disabled = !file || !selectedTemplate; // 👈 disable if file is empty

  const handleUploadCropped = useCallback(async (editedFile: File) => {
    try {
      const res = await uploadFile(editedFile);
      if (!res.success) {
        toast(`Greska pri editu`, {
          type: 'error',
        });
        return;
      }
      const url = res.url ?? '';
      setFileInfo((prev) => (prev ? { ...prev, url } : prev));
      toast(`Uspesno editovanje slike`, {
        type: 'success',
      });
    } catch (err) {
      toast(`Greska pri editu`, {
        type: 'error',
      });
    }
  }, []);

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            color="primary"
            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            2. Konfigurišite štampanje
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Popunite opcije da vidite procenu
          </Typography>
        }
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          opacity: disabled ? 0.5 : 1, // 👈 visual feedback
          pointerEvents: disabled ? 'none' : 'auto', // 👈 block interaction
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            {printConfig && (
              <FormControl fullWidth disabled={disabled}>
                <InputLabel>Broj primeraka</InputLabel>
                <Select
                  value={quantity} // safety
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  label={'Broj Primeraka'}
                >
                  {' '}
                  {[...Array(10)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
          {selectedTemplate &&
            printConfig &&
            (Object.entries(selectedTemplate.allowedOptions) as [string, OptionField][]).map(
              ([key, field]) => (
                <Grid size={{ xs: 12, md: 6 }} key={key}>
                  {field.type === 'select' && field.options && (
                    <FormControl fullWidth disabled={disabled}>
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        value={printConfig[key] ?? field.default} // safety
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

                  {field.type === 'radio' && field.options && printConfig && (
                    <FormControl component="fieldset" disabled={disabled}>
                      <FormLabel>{field.label}</FormLabel>
                      <RadioGroup
                        value={printConfig[key] ?? field.default}
                        onChange={(e) => updateConfig(key, e.target.value)}
                      >
                        {field.options.map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio />}
                            label={opt.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}

                  {field.type === 'checkbox' && printConfig && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!printConfig[key]}
                          onChange={(e) => updateConfig(key, e.target.checked)}
                          disabled={disabled}
                        />
                      }
                      label={field.label}
                    />
                  )}
                </Grid>
              ),
            )}
        </Grid>
        <>
          {file ? (
            <Button
              variant="contained"
              onClick={() => {
                setImage(URL.createObjectURL(file));
                setOpen(true);
              }}
            >
              Crop Image
            </Button>
          ) : null}

          {image && (
            <ImageCropperDialog
              open={open}
              image={image}
              aspect={1} // kvadrat, promeniti za šolju/majicu
              onComplete={(editedFile) => editedFile && handleUploadCropped(editedFile)}
              onClose={() => setOpen(false)}
            />
          )}
        </>
      </CardContent>
    </Card>
  );
}
