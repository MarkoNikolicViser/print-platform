"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Switch,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import { Save, MapPin, Clock, CreditCard } from "lucide-react"

interface ShopConfig {
  name: string
  address: string
  city: string
  phone: string
  email: string
  workingHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  services: string[]
  bankAccount: string
  description: string
  isActive: boolean
  maxOrdersPerDay: number
  estimatedProcessingTime: number
}

const availableServices = [
  "Štampanje",
  "Kopiranje",
  "Skeniranje",
  "Povezivanje",
  "Laminiranje",
  "Foto štampanje",
  "Dizajn",
  "Plotovanje",
]

const dayNames = {
  monday: "Ponedeljak",
  tuesday: "Utorak",
  wednesday: "Sreda",
  thursday: "Četvrtak",
  friday: "Petak",
  saturday: "Subota",
  sunday: "Nedelja",
}

export function ShopSettings() {
  const [config, setConfig] = useState<ShopConfig>({
    name: "Copy Centar Beograd",
    address: "Knez Mihailova 15",
    city: "Beograd",
    phone: "+381 11 123-4567",
    email: "info@copycentar.rs",
    workingHours: {
      monday: { open: "08:00", close: "20:00", closed: false },
      tuesday: { open: "08:00", close: "20:00", closed: false },
      wednesday: { open: "08:00", close: "20:00", closed: false },
      thursday: { open: "08:00", close: "20:00", closed: false },
      friday: { open: "08:00", close: "20:00", closed: false },
      saturday: { open: "09:00", close: "17:00", closed: false },
      sunday: { open: "10:00", close: "15:00", closed: true },
    },
    services: ["Štampanje", "Kopiranje", "Skeniranje", "Povezivanje"],
    bankAccount: "160-5000001234567-89",
    description: "Profesionalna štamparija u centru Beograda sa dugogodišnjim iskustvom.",
    isActive: true,
    maxOrdersPerDay: 50,
    estimatedProcessingTime: 45,
  })

  const [hasChanges, setHasChanges] = useState(false)

  const updateConfig = (path: string, value: any) => {
    setConfig((prev) => {
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

  const toggleService = (service: string) => {
    const newServices = config.services.includes(service)
      ? config.services.filter((s) => s !== service)
      : [...config.services, service]
    updateConfig("services", newServices)
  }

  const saveConfig = () => {
    // In a real app, this would save to the backend
    console.log("Saving shop configuration:", config)
    setHasChanges(false)
  }

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
            Podešavanja štamparije
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upravljajte informacijama o vašoj štampariji
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={saveConfig}
          disabled={!hasChanges}
          startIcon={<Save size={16} />}
        >
          Sačuvaj izmene
        </Button>
      </Box>

      {/* Basic Information */}
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <MapPin size={20} />
              <Typography variant="subtitle1" color="primary">
                Osnovne informacije
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Naziv štamparije"
                value={config.name}
                onChange={(e) => updateConfig("name", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Grad"
                value={config.city}
                onChange={(e) => updateConfig("city", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Adresa"
                value={config.address}
                onChange={(e) => updateConfig("address", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Telefon"
                value={config.phone}
                onChange={(e) => updateConfig("phone", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email"
                type="email"
                value={config.email}
                onChange={(e) => updateConfig("email", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Opis"
                value={config.description}
                onChange={(e) => updateConfig("description", e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Switch
                  checked={config.isActive}
                  onChange={(e) => updateConfig("isActive", e.target.checked)}
                />
                <Typography>Štamparija je aktivna i prima narudžbine</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <Clock size={20} />
              <Typography variant="subtitle1" color="primary">
                Radno vreme
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {Object.entries(config.workingHours).map(([day, hours]) => (
              <Box key={day} display="flex" alignItems="center" gap={2}>
                <Box width={100}>
                  <Typography color="primary" fontWeight="medium">
                    {dayNames[day]}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Switch
                    checked={!hours.closed}
                    onChange={(e) =>
                      updateConfig(`workingHours.${day}.closed`, !e.target.checked)
                    }
                  />
                  <Typography variant="body2">Radi</Typography>
                </Box>
                {!hours.closed && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      type="time"
                      value={hours.open}
                      onChange={(e) => updateConfig(`workingHours.${day}.open`, e.target.value)}
                      size="small"
                    />
                    <Typography>-</Typography>
                    <TextField
                      type="time"
                      value={hours.close}
                      onChange={(e) => updateConfig(`workingHours.${day}.close`, e.target.value)}
                      size="small"
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader
          title={
            <Typography variant="subtitle1" color="primary">
              Usluge
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            {availableServices.map((service) => {
              const isSelected = config.services.includes(service);
              return (
                <Grid size={{ xs: 6, md: 3 }} key={service}>
                  <Paper
                    onClick={() => toggleService(service)}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: isSelected ? "primary.main" : "grey.300",
                      backgroundColor: isSelected ? "action.hover" : "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight="medium">
                        {service}
                      </Typography>
                      {isSelected && <Chip label="✓" size="small" color="primary" />}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Payment & Operations */}
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <CreditCard size={20} />
              <Typography variant="subtitle1" color="primary">
                Plaćanje i operacije
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Broj računa za doznake"
                value={config.bankAccount}
                onChange={(e) => updateConfig("bankAccount", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Maksimalno narudžbina dnevno"
                type="number"
                value={config.maxOrdersPerDay}
                onChange={(e) =>
                  updateConfig("maxOrdersPerDay", parseInt(e.target.value, 10))
                }
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Prosečno vreme obrade (minuti)"
                type="number"
                value={config.estimatedProcessingTime}
                onChange={(e) =>
                  updateConfig("estimatedProcessingTime", parseInt(e.target.value, 10))
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
