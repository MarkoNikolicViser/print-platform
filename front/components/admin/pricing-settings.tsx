"use client"

import { useState } from "react"
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
  Divider,
} from "@mui/material";
import { Save, DollarSign } from "lucide-react";

interface PricingConfig {
  basePricePerPage: number
  colorMultiplier: number
  doubleSidedDiscount: number
  paperSizePricing: {
    a5: number
    a4: number
    a3: number
    a2: number
  }
  paperTypePricing: {
    standard: number
    premium: number
    photo: number
    cardstock: number
  }
  bindingPricing: {
    staple: number
    spiral: number
    thermal: number
  }
  bulkDiscounts: {
    enabled: boolean
    tier1: { min: number; discount: number }
    tier2: { min: number; discount: number }
    tier3: { min: number; discount: number }
  }
}

export function PricingSettings() {
  const [pricing, setPricing] = useState<PricingConfig>({
    basePricePerPage: 10,
    colorMultiplier: 3.0,
    doubleSidedDiscount: 0.2,
    paperSizePricing: {
      a5: 0.8,
      a4: 1.0,
      a3: 2.0,
      a2: 3.5,
    },
    paperTypePricing: {
      standard: 1.0,
      premium: 1.5,
      photo: 2.0,
      cardstock: 1.8,
    },
    bindingPricing: {
      staple: 20,
      spiral: 50,
      thermal: 100,
    },
    bulkDiscounts: {
      enabled: true,
      tier1: { min: 50, discount: 0.05 },
      tier2: { min: 100, discount: 0.1 },
      tier3: { min: 200, discount: 0.15 },
    },
  })

  const [hasChanges, setHasChanges] = useState(false)

  const updatePricing = (path: string, value: any) => {
    setPricing((prev) => {
      const keys = path.split(".")
      const updated = { ...prev }
      let current: any = updated

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return updated
    })
    setHasChanges(true)
  }

  const savePricing = () => {
    // In a real app, this would save to the backend
    console.log("Saving pricing configuration:", pricing)
    setHasChanges(false)
  }

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
            Podešavanje cena
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Konfigurišite cene za različite usluge štampanja
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={savePricing}
          disabled={!hasChanges}
          startIcon={<Save size={16} />}
        >
          Sačuvaj izmene
        </Button>
      </Box>

      {/* Base Pricing */}
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <DollarSign size={20} />
              <Typography variant="subtitle1" color="primary">
                Osnovno cenovnik
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Osnovna cena po stranici (RSD)"
                type="number"
                value={pricing.basePricePerPage}
                onChange={(e) =>
                  updatePricing("basePricePerPage", parseFloat(e.target.value))
                }
                fullWidth
                inputProps={{ step: 0.1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Množilac za boju"
                type="number"
                value={pricing.colorMultiplier}
                onChange={(e) =>
                  updatePricing("colorMultiplier", parseFloat(e.target.value))
                }
                fullWidth
                inputProps={{ step: 0.1 }}
                helperText="Koliko puta je skuplje od crno-bele"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Popust za obostrano (%)"
                type="number"
                value={pricing.doubleSidedDiscount * 100}
                onChange={(e) =>
                  updatePricing("doubleSidedDiscount", parseFloat(e.target.value) / 100)
                }
                fullWidth
                inputProps={{ step: 1, max: 50 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Paper Size Pricing */}
      <Card>
        <CardHeader title="Cene po formatu papira" />
        <CardContent>
          <Grid container spacing={3}>
            {Object.entries(pricing.paperSizePricing).map(([size, multiplier]) => (
              <Grid sx={{ xs: 6, md: 3 }} key={size}>
                <TextField
                  label={`${size.toUpperCase()} množilac`}
                  type="number"
                  value={multiplier}
                  onChange={(e) =>
                    updatePricing(`paperSizePricing.${size}`, parseFloat(e.target.value))
                  }
                  fullWidth
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Paper Type Pricing */}
      <Card>
        <CardHeader title="Cene po tipu papira" />
        <CardContent>
          <Grid container spacing={3}>
            {Object.entries(pricing.paperTypePricing).map(([type, multiplier]) => (
              <Grid size={{ xs: 6, md: 3 }} key={type}>
                <TextField
                  label={`${type.charAt(0).toUpperCase() + type.slice(1)} množilac`}
                  type="number"
                  value={multiplier}
                  onChange={(e) =>
                    updatePricing(`paperTypePricing.${type}`, parseFloat(e.target.value))
                  }
                  fullWidth
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Binding Pricing */}
      <Card>
        <CardHeader title="Cene povezivanja" />
        <CardContent>
          <Grid container spacing={3}>
            {Object.entries(pricing.bindingPricing).map(([type, price]) => (
              <Grid size={{ xs: 12, md: 4 }} key={type}>
                <TextField
                  label={`${type.charAt(0).toUpperCase() + type.slice(1)} (RSD)`}
                  type="number"
                  value={price}
                  onChange={(e) =>
                    updatePricing(`bindingPricing.${type}`, parseFloat(e.target.value))
                  }
                  fullWidth
                  inputProps={{ step: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Bulk Discounts */}
      <Card>
        <CardHeader title="Popusti za veće količine" />
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Switch
              checked={pricing.bulkDiscounts.enabled}
              onChange={(e) => updatePricing("bulkDiscounts.enabled", e.target.checked)}
            />
            <Typography>Omogući popuste za veće količine</Typography>
          </Box>

          {pricing.bulkDiscounts.enabled && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                {Object.entries(pricing.bulkDiscounts)
                  .filter(([key]) => key !== "enabled")
                  .map(([tier, config]) => (
                    <Box key={tier}>
                      <Grid size={{ xs: 12, md: 10 }} pb={2}>
                        <TextField
                          label={`${tier.toUpperCase()} - Minimum stranica`}
                          type="number"
                          value={config.min}
                          onChange={(e) =>
                            updatePricing(`bulkDiscounts.${tier}.min`, parseInt(e.target.value))
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 10 }}>
                        <TextField
                          label="Popust (%)"
                          type="number"
                          value={config.discount * 100}
                          onChange={(e) =>
                            updatePricing(
                              `bulkDiscounts.${tier}.discount`,
                              parseFloat(e.target.value) / 100
                            )
                          }
                          fullWidth
                          inputProps={{ step: 1, max: 50 }}
                        />
                      </Grid>
                    </Box>
                  ))}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader title="Pregled cena" />
        <CardContent>
          <Typography variant="body2" gutterBottom>
            <strong>Primer:</strong> 10 stranica A4, crno-belo, obostrano, spiralno povezivanje
          </Typography>
          <Typography variant="body2">
            Cena: {pricing.basePricePerPage} × 10 × {pricing.paperSizePricing.a4} × (1 - {pricing.doubleSidedDiscount}) + {pricing.bindingPricing.spiral} ={" "}
            <strong>
              {Math.round(
                pricing.basePricePerPage *
                10 *
                pricing.paperSizePricing.a4 *
                (1 - pricing.doubleSidedDiscount) +
                pricing.bindingPricing.spiral
              )}{" "}
              RSD
            </strong>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
