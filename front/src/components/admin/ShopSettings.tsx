"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import type { CopyShop } from "../../types"

const ShopSettings: React.FC = () => {
  const [shopData, setShopData] = useState<Partial<CopyShop>>({
    name: "Štamparija Centar",
    address: "Knez Mihailova 15",
    city: "Beograd",
    phone: "+381 11 123 4567",
    email: "info@stamparija-centar.rs",
    workingHours: "Pon-Pet: 08:00-20:00, Sub: 09:00-15:00",
    services: ["Štampanje", "Kopiranje", "Skeniranje", "Laminiranje", "Spiralno povezivanje"],
    isActive: true,
  })

  const [newService, setNewService] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleInputChange = (field: keyof CopyShop, value: any) => {
    setShopData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddService = () => {
    if (newService.trim() && shopData.services) {
      setShopData((prev) => ({
        ...prev,
        services: [...(prev.services || []), newService.trim()],
      }))
      setNewService("")
    }
  }

  const handleRemoveService = (serviceToRemove: string) => {
    setShopData((prev) => ({
      ...prev,
      services: prev.services?.filter((service) => service !== serviceToRemove) || [],
    }))
  }

  const handleSave = async () => {
    // Here you would call the Strapi service to update shop data
    // await strapiService.updateCopyShop(shopId, shopData)
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
        PODEŠAVANJA ŠTAMPARIJE
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Podešavanja su uspešno sačuvana!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 3 }}>
                OSNOVNE INFORMACIJE
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Naziv štamparije"
                    value={shopData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresa"
                    value={shopData.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Grad"
                    value={shopData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={shopData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={shopData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Radno vreme"
                    value={shopData.workingHours || ""}
                    onChange={(e) => handleInputChange("workingHours", e.target.value)}
                    helperText="Primer: Pon-Pet: 08:00-20:00, Sub: 09:00-15:00"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Services and Status */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 3 }}>
                USLUGE I STATUS
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={shopData.isActive || false}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    color="success"
                  />
                }
                label="Štamparija je aktivna"
                sx={{ mb: 3 }}
              />

              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                Usluge:
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {shopData.services?.map((service) => (
                  <Chip
                    key={service}
                    label={service}
                    onDelete={() => handleRemoveService(service)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  label="Nova usluga"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddService()}
                />
                <Button variant="outlined" onClick={handleAddService} disabled={!newService.trim()}>
                  Dodaj
                </Button>
              </Box>
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
          Sačuvaj podešavanja
        </Button>
      </Box>
    </Box>
  )
}

export default ShopSettings
