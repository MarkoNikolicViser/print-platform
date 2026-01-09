"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
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
} from "@mui/material"

interface OptionField {
  type: "number" | "select" | "radio" | "checkbox"
  default: any
  min?: number
  max?: number
  options?: { value: string; label: string }[]
}

interface AllowedOptions {
  [key: string]: OptionField
}

interface PrintConfigSectionProps {
  allowedOptions: AllowedOptions
}
const allowedOptions = {
  quantity: { type: "number", min: 1, max: 1000, default: 1 },
  paperSize: {
    type: "select", options: [
      { value: "a4", label: "A4 (210×297mm)" },
      { value: "a3", label: "A3 (297×420mm)" }
    ], default: "a4"
  },
  paperType: {
    type: "radio", options: [
      { value: "standard", label: "Standard (80g)" },
      { value: "premium", label: "Premium (120g)" }
    ], default: "standard"
  },
  isColor: { type: "checkbox", default: false },
  isDoubleSided: { type: "checkbox", default: false },
  binding: {
    type: "radio", options: [
      { value: "none", label: "Bez povezivanja" },
      { value: "staple", label: "Heftalica" }
    ], default: "none"
  }
}


export function PrintConfigSection() {
  const initialConfig = Object.keys(allowedOptions).reduce((acc, key) => {
    acc[key] = allowedOptions[key].default
    return acc
  }, {} as Record<string, any>)

  const [config, setConfig] = useState(initialConfig)

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" color="primary" sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
            Konfigurišite štampanje
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Popunite opcije da vidite procenu
          </Typography>
        }
      />
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Grid container spacing={2}>
          {Object.entries(allowedOptions).map(([key, field]) => (
            <Grid size={{ xs: 12, md: 6 }} key={key}>
              {field.type === "number" && (
                <TextField
                  label={key}
                  type="number"
                  value={config[key]}
                  onChange={(e) => updateConfig(key, Math.max(field.min || 0, Math.min(field.max || Infinity, Number(e.target.value))))}
                  inputProps={{ min: field.min, max: field.max }}
                  fullWidth
                />
              )}

              {field.type === "select" && field.options && (
                <FormControl fullWidth>
                  <InputLabel>{key}</InputLabel>
                  <Select
                    value={config[key]}
                    onChange={(e) => updateConfig(key, e.target.value)}
                    label={key}
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
                <FormControl component="fieldset">
                  <FormLabel component="legend">{key}</FormLabel>
                  <RadioGroup
                    value={config[key]}
                    onChange={(e) => updateConfig(key, e.target.value)}
                  >
                    {field.options.map((opt) => (
                      <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {field.type === "checkbox" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config[key]}
                      onChange={(e) => updateConfig(key, e.target.checked)}
                    />
                  }
                  label={key}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Box mt={2}>
          <Typography variant="body2">Trenutna konfiguracija:</Typography>
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </Box>
      </CardContent>
    </Card>
  )
}
