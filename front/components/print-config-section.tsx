"use client"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"
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
  Chip,
  IconButton,
} from "@mui/material";

interface PrintConfig {
  quantity: number
  paperSize: string
  paperType: string
  isColor: boolean
  isDoubleSided: boolean
  binding: string
  copies: number
}

interface FileData {
  pages: number
  estimatedCost: number
}

export function PrintConfigSection() {
  const [config, setConfig] = useState<PrintConfig>({
    quantity: 1,
    paperSize: "a4",
    paperType: "standard",
    isColor: false,
    isDoubleSided: false,
    binding: "none",
    copies: 1,
  })

  const [fileData, setFileData] = useState<FileData | null>(null)
  const [totalCost, setTotalCost] = useState(0)

  // Listen for file calculation events
  useEffect(() => {
    const handleFileCalculated = (event: CustomEvent) => {
      setFileData({
        pages: event.detail.pages,
        estimatedCost: event.detail.estimatedCost,
      })
    }

    window.addEventListener("fileCalculated", handleFileCalculated as EventListener)
    return () => window.removeEventListener("fileCalculated", handleFileCalculated as EventListener)
  }, [])

  // Calculate total cost when config or file data changes
  useEffect(() => {
    if (!fileData) {
      setTotalCost(0)
      return
    }

    const baseCost = fileData.pages * config.copies * config.quantity

    // Paper size multiplier
    const paperSizeMultiplier =
      {
        a5: 0.8,
        a4: 1.0,
        a3: 2.0,
        a2: 3.5,
      }[config.paperSize] || 1.0

    // Paper type multiplier
    const paperTypeMultiplier =
      {
        standard: 1.0,
        premium: 1.5,
        photo: 2.0,
        cardstock: 1.8,
      }[config.paperType] || 1.0

    // Color printing multiplier
    const colorMultiplier = config.isColor ? 3.0 : 1.0

    // Double-sided discount
    const doubleSidedMultiplier = config.isDoubleSided ? 0.8 : 1.0

    // Binding cost
    const bindingCost =
      {
        none: 0,
        staple: 20,
        spiral: 50,
        thermal: 100,
      }[config.binding] || 0

    const calculatedCost =
      baseCost * paperSizeMultiplier * paperTypeMultiplier * colorMultiplier * doubleSidedMultiplier +
      bindingCost * config.quantity

    setTotalCost(Math.round(calculatedCost))
  }, [config, fileData])

  const updateConfig = (updates: Partial<PrintConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const paperSizes = [
    { value: "a5", label: "A5 (148×210mm)", description: "Mala" },
    { value: "a4", label: "A4 (210×297mm)", description: "Standardna" },
    { value: "a3", label: "A3 (297×420mm)", description: "Velika" },
    { value: "a2", label: "A2 (420×594mm)", description: "Vrlo velika" },
  ]

  const paperTypes = [
    { value: "standard", label: "Standardni papir (80g)", price: "1x" },
    { value: "premium", label: "Premium papir (120g)", price: "1.5x" },
    { value: "photo", label: "Foto papir", price: "2x" },
    { value: "cardstock", label: "Karton (200g)", price: "1.8x" },
  ]

  const bindingOptions = [
    { value: "none", label: "Bez povezivanja", price: "0 RSD" },
    { value: "staple", label: "Heftalica", price: "+20 RSD" },
    { value: "spiral", label: "Spiralno", price: "+50 RSD" },
    { value: "thermal", label: "Termalno", price: "+100 RSD" },
  ]
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" color="primary" sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
            Korak 2: Konfigurišite štampanje
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Podesite opcije da vidite konačnu cenu
          </Typography>
        }
      />
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Quantity & Copies */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }} >
            <TextField
              label="Broj primeraka"
              type="number"
              value={config.quantity}
              onChange={(e) =>
                updateConfig({ quantity: Math.max(1, Number.parseInt(e.target.value) || 1) })
              }
              inputProps={{ min: 1, max: 1000 }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} >
            <TextField
              label="Kopija po dokumentu"
              type="number"
              value={config.copies}
              onChange={(e) =>
                updateConfig({ copies: Math.max(1, Number.parseInt(e.target.value) || 1) })
              }
              inputProps={{ min: 1, max: 100 }}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Paper Size */}
        <FormControl fullWidth>
          <InputLabel>Format papira</InputLabel>
          <Select
            value={config.paperSize}
            onChange={(e) => updateConfig({ paperSize: e.target.value })}
            label="Format papira"
          >
            {paperSizes.map((size) => (
              <MenuItem key={size.value} value={size.value}>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <span>{size.label}</span>
                  <Chip label={size.description} size="small" />
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Paper Type */}
        <FormControl component="fieldset">
          <FormLabel component="legend">Tip papira</FormLabel>
          <RadioGroup
            value={config.paperType}
            onChange={(e) => updateConfig({ paperType: e.target.value })}
          >
            <Grid container spacing={2}>
              {paperTypes.map((type) => (
                <Grid size={{ xs: 12, md: 6 }} key={type.value}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    border={1}
                    borderRadius={2}
                    p={2}
                  >
                    <FormControlLabel
                      value={type.value}
                      control={<Radio />}
                      label={type.label}
                    />
                    <Chip label={type.price} variant="outlined" />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>

        {/* Print Options */}
        <FormLabel component="legend">Opcije štampanja</FormLabel>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }} >
            <Box display="flex" alignItems="center" border={1} borderRadius={2} p={2} gap={2}>
              <Checkbox
                checked={config.isColor}
                onChange={(e) => updateConfig({ isColor: e.target.checked })}
              />
              <Box flexGrow={1}>
                <Typography variant="body1">Štampanje u boji</Typography>
                <Typography variant="caption" color="text.secondary">
                  3x skuplje od crno-bele
                </Typography>
              </Box>
              <Chip label={config.isColor ? "3x" : "1x"} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} >
            <Box display="flex" alignItems="center" border={1} borderRadius={2} p={2} gap={2}>
              <Checkbox
                checked={config.isDoubleSided}
                onChange={(e) => updateConfig({ isDoubleSided: e.target.checked })}
              />
              <Box flexGrow={1}>
                <Typography variant="body1">Obostrano štampanje</Typography>
                <Typography variant="caption" color="text.secondary">
                  20% popust na ukupnu cenu
                </Typography>
              </Box>
              <Chip label={config.isDoubleSided ? "-20%" : "0%"} />
            </Box>
          </Grid>
        </Grid>

        {/* Binding Options */}
        <FormControl component="fieldset">
          <FormLabel component="legend">Povezivanje</FormLabel>
          <RadioGroup
            value={config.binding}
            onChange={(e) => updateConfig({ binding: e.target.value })}
          >
            <Grid container spacing={2}>
              {bindingOptions.map((option) => (
                <Grid size={{ xs: 12, md: 6 }} key={option.value}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    border={1}
                    borderRadius={2}
                    p={2}
                  >
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                    <Chip label={option.price} variant="outlined" />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>

        {/* Cost Summary */}
        <Card variant="outlined">
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  Procena cene
                </Typography>
                <Info size={16} />
              </Box>
            }
          />
          <CardContent>
            {fileData ? (
              <Box display="flex" flexDirection="column" gap={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Box p={2} border={1} borderRadius={2}>
                      <Typography variant="caption" color="text.secondary">Stranica</Typography>
                      <Typography variant="h6" color="primary">{fileData.pages}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Box p={2} border={1} borderRadius={2}>
                      <Typography variant="caption" color="text.secondary">Primerci</Typography>
                      <Typography variant="h6" color="primary">{config.quantity}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Box p={2} border={1} borderRadius={2}>
                      <Typography variant="caption" color="text.secondary">Kopije</Typography>
                      <Typography variant="h6" color="primary">{config.copies}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Box p={2} border={1} borderRadius={2}>
                      <Typography variant="caption" color="text.secondary">Ukupno</Typography>
                      <Typography variant="h6" color="primary">{totalCost} RSD</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    • Osnovna cena: {fileData.pages} stranica × {config.copies} kopija × {config.quantity} primeraka
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • Format: {paperSizes.find((s) => s.value === config.paperSize)?.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • Papir: {paperTypes.find((t) => t.value === config.paperType)?.label}
                  </Typography>
                  {config.isColor && (
                    <Typography variant="caption" color="text.secondary">
                      • Štampanje u boji (+200%)
                    </Typography>
                  )}
                  {config.isDoubleSided && (
                    <Typography variant="caption" color="text.secondary">
                      • Obostrano štampanje (-20%)
                    </Typography>
                  )}
                  {config.binding !== "none" && (
                    <Typography variant="caption" color="text.secondary">
                      • Povezivanje: {bindingOptions.find((b) => b.value === config.binding)?.label}
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Box textAlign="center" py={4} color="text.secondary">
                <Info size={32} style={{ marginBottom: 8 }} />
                <Typography variant="body2">
                  Otpremite fajl da vidite procenu cene
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

