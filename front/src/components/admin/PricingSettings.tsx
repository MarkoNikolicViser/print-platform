"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Card, CardContent, Grid, TextField, Button, InputAdornment, Alert } from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import type { ShopPricing } from "../../types"

const PricingSettings: React.FC = () => {
  const [pricing, setPricing] = useState<ShopPricing>({
    blackWhite: 5,
    color: 15,
    doubleSidedDiscount: 20,
    paperTypes: {
      standard: 1,
      premium: 1.5,
      photo: 2,
    },
    binding: {
      staple: 20,
      spiral: 50,
      hardcover: 150,
    },
  })

  const [saveSuccess, setSaveSuccess] = useState(false)

  const handlePricingChange = (field: keyof ShopPricing, value: any) => {
    setPricing((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedChange = (parent: keyof ShopPricing, field: string, value: number) => {
    setPricing((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    // Here you would call the Strapi service to update pricing
    // await strapiService.updateCopyShop(shopId, { pricing })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h2"
        sx={{
          mb: 4,
          fontSize: "1.5rem",
          color: "primary.main",
          fontWeight: 700,
        }}
      >
        PODEŠAVANJE CENA
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Cene su uspešno ažurirane!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Basic Printing Prices */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 3 }}>
                OSNOVNE CENE ŠTAMPE
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Crno-belo štampanje"
                    type="number"
                    value={pricing.blackWhite}
                    onChange={(e) => handlePricingChange("blackWhite", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">RSD/strana</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Štampanje u boji"
                    type="number"
                    value={pricing.color}
                    onChange={(e) => handlePricingChange("color", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">RSD/strana</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Popust za dvostrano štampanje"
                    type="number"
                    value={pricing.doubleSidedDiscount}
                    onChange={(e) => handlePricingChange("doubleSidedDiscount", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="Procenat popusta za dvostrano štampanje"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Paper Type Multipliers */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 3 }}>
                TIPOVI PAPIRA
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Standardni papir (80g)"
                    type="number"
                    value={pricing.paperTypes.standard}
                    onChange={(e) => handleNestedChange("paperTypes", "standard", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">× osnovna cena</InputAdornment>,
                      inputProps: {
                        step: "0.1"
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Premium papir (120g)"
                    type="number"
                    value={pricing.paperTypes.premium}
                    onChange={(e) => handleNestedChange("paperTypes", "premium", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">× osnovna cena</InputAdornment>,
                      inputProps: {
                        step: "0.1"
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Foto papir"
                    type="number"
                    value={pricing.paperTypes.photo}
                    onChange={(e) => handleNestedChange("paperTypes", "photo", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">× osnovna cena</InputAdornment>,
                      inputProps: {
                        step: "0.1"
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Binding Costs */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 3 }}>
                CENE POVEZIVANJA
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Heftalica"
                    type="number"
                    value={pricing.binding.staple}
                    onChange={(e) => handleNestedChange("binding", "staple", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">RSD</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Spiralno povezivanje"
                    type="number"
                    value={pricing.binding.spiral}
                    onChange={(e) => handleNestedChange("binding", "spiral", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">RSD</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Tvrdi povez"
                    type="number"
                    value={pricing.binding.hardcover}
                    onChange={(e) => handleNestedChange("binding", "hardcover", Number(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">RSD</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ px: 4, py: 1.5 }}
        >
          Sačuvaj cene
        </Button>
      </Box>
    </Box>
  )
}

export default PricingSettings
