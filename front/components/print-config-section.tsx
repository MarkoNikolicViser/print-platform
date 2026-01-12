"use client";

import { useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import { usePrintContext } from "@/context/PrintContext";

interface OptionField {
  type: "number" | "select" | "radio" | "checkbox";
  default: any;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
}

interface AllowedOptions {
  [key: string]: OptionField;
}

interface PrintConfigSectionProps {
  allowedOptions: AllowedOptions;
  file: File | null; // 👈 add file prop
}

const allowedOptions: AllowedOptions = {
  quantity: { type: "number", min: 1, max: 1000, default: 1 },

  "paper_size": {
    "type": "select",
    "options": [
      {
        value: "a4",
        label: "A4 (210×297mm)"
      },
      {
        value: "a3",
        label: "A3 (297×420mm)"
      }
    ],
    "default": "a4"
  },
  "color": {
    "type": "select",
    "options": [
      {
        value: "bw",
        label: "crno/belo"
      },
      {
        value: "color",
        label: "u boji"
      }
    ],
    "default": "bw"
  },
  "binding": {
    "type": "select",
    "options": [
      {
        value: "none",
        label: "bez"
      },
      {
        value: "spiral",
        label: "spirala"
      },
      {
        value: "staple",
        label: "heftalica"
      }
    ],
    "default": "none"
  },
  "doubleSided": {
    "type": "select",
    "options": [
      {
        value: true,
        label: "obostrano"
      },
      {
        value: false,
        label: "jednostrano"
      }
    ],
    "default": true
  }
};

export function PrintConfigSection() {
  const { file, selectedTemplate, printConfig, setPrintConfig } = usePrintContext();
  const [initialConfig, setInitialConfig] = useState(Object.keys(allowedOptions).reduce((acc, key) => {
    acc[key] = allowedOptions[key]?.default;
    return acc;
  }, {} as Record<string, any>))

  // const [printConfig, setConfig] = useState(initialConfig);
  useEffect(() => { setPrintConfig(initialConfig) }, [])
  const updateConfig = (key: string, value: any) => {
    setPrintConfig((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    if (!selectedTemplate) {
      return
    }
    const temp = Object?.keys(selectedTemplate?.allowedOptions)?.reduce((acc, key) => {
      acc[key] = selectedTemplate?.allowedOptions[key]?.default;
      return acc;
    }, {} as Record<string, any>)
    setInitialConfig(temp)
    setPrintConfig(temp)
  }, [selectedTemplate])

  const disabled = !file || !selectedTemplate; // 👈 disable if file is empty

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            color="primary"
            sx={{ textTransform: "uppercase", fontWeight: "bold" }}
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
          display: "flex",
          flexDirection: "column",
          gap: 3,
          opacity: disabled ? 0.5 : 1, // 👈 visual feedback
          pointerEvents: disabled ? "none" : "auto", // 👈 block interaction
        }}
      >
        <Grid container spacing={2}>
          {selectedTemplate &&
            Object.entries(selectedTemplate.allowedOptions).map(([key, field]) => (
              <Grid size={{ xs: 12, md: 6 }} key={key}>
                {field.type === "select" && field.options && (
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

                {field.type === "radio" && field.options && (
                  <FormControl component="fieldset" disabled={disabled}>
                    <FormLabel>{key}</FormLabel>
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

                {field.type === "checkbox" && (
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
            ))}
        </Grid>

        <Box mt={2}>
          <Typography variant="body2">Trenutna konfiguracija:</Typography>
          <pre>{JSON.stringify(printConfig, null, 2)}</pre>
        </Box>
      </CardContent>
    </Card>
  );
}