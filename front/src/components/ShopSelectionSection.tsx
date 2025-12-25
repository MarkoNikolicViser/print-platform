"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Rating,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PaymentIcon from "@mui/icons-material/Payment"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useCopyShops } from "../hooks/useCopyShops"
import { usePrintJobs } from "../hooks/usePrintJobs"
import { strapiService } from "../services/strapiService"
import type { PrintOptions, CopyShop } from "../types"

interface ShopSelectionSectionProps {
  fileData: {
    fileName: string
    fileUrl: string
    fileSize: number
    pageCount: number
  }
  printOptions: PrintOptions
  onBack: () => void
}

const ShopSelectionSection: React.FC<ShopSelectionSectionProps> = ({ fileData, printOptions, onBack }) => {
  const { shops, loading, error } = useCopyShops()
  const { createPrintJob } = usePrintJobs()
  const [selectedShop, setSelectedShop] = useState<CopyShop | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleShopSelect = (shop: CopyShop) => {
    setSelectedShop(shop)
  }

  const handleOrderSubmit = () => {
    if (!selectedShop) return
    setShowPaymentDialog(true)
  }

  const handlePaymentConfirm = async () => {
    if (!selectedShop) return

    setSubmitting(true)
    try {
      const totalCost = strapiService.calculatePrintCost(selectedShop, fileData.pageCount, printOptions)

      const printJob = await createPrintJob({
        fileName: fileData.fileName,
        fileUrl: fileData.fileUrl,
        fileSize: fileData.fileSize,
        pageCount: fileData.pageCount,
        printOptions,
        shopId: selectedShop.id,
        status: "pending",
        totalCost,
      })

      if (printJob) {
        // Send confirmation email
        await strapiService.sendOrderConfirmation(printJob, customerInfo.email)
        setOrderComplete(true)
        setShowPaymentDialog(false)
      }
    } catch (error) {
      console.error("Error creating order:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        Greška pri učitavanju štamparija: {error}
      </Alert>
    )
  }

  if (orderComplete) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "3px solid",
          borderColor: "success.main",
          borderRadius: 2,
          backgroundColor: "rgba(16, 185, 129, 0.05)",
          textAlign: "center",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
        <Typography variant="h2" sx={{ mb: 2, color: "success.main" }}>
          NARUDŽBA USPEŠNO KREIRANA!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Vaša narudžba je poslata u štampariju <strong>{selectedShop?.name}</strong>.
          <br />
          Dobićete email potvrdu na adresu: <strong>{customerInfo.email}</strong>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => window.location.reload()}
          sx={{ px: 4, py: 1.5 }}
        >
          Nova narudžba
        </Button>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        border: "3px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 2,
          fontSize: "1.5rem",
          color: "primary.main",
          fontWeight: 700,
        }}
      >
        KORAK 3: IZBOR ŠTAMPARIJE
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "text.primary" }}>
        Izaberite štampariju gde želite da preuzmete vašu narudžbu
      </Typography>

      <Grid container spacing={3}>
        {shops.map((shop) => {
          const finalCost = strapiService.calculatePrintCost(shop, fileData.pageCount, printOptions)
          const isSelected = selectedShop?.id === shop.id

          return (
            <Grid item xs={12} md={6} key={shop.id}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: isSelected ? "secondary.main" : "primary.main",
                  backgroundColor: isSelected ? "rgba(249, 115, 22, 0.05)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "secondary.main",
                    backgroundColor: "rgba(249, 115, 22, 0.05)",
                  },
                }}
                onClick={() => handleShopSelect(shop)}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>
                      {shop.name}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "secondary.main",
                        fontWeight: 700,
                      }}
                    >
                      {finalCost} RSD
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {shop.address}, {shop.city}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {shop.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {shop.workingHours}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Rating value={shop.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      ({shop.rating}/5)
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {shop.services.slice(0, 3).map((service) => (
                      <Chip key={service} label={service} size="small" variant="outlined" />
                    ))}
                    {shop.services.length > 3 && (
                      <Chip label={`+${shop.services.length - 3} više`} size="small" variant="outlined" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {selectedShop && (
        <Paper
          sx={{
            mt: 4,
            p: 3,
            border: "2px solid",
            borderColor: "secondary.main",
            backgroundColor: "rgba(249, 115, 22, 0.05)",
          }}
        >
          <Typography variant="h6" sx={{ color: "secondary.main", fontWeight: 700, mb: 2 }}>
            IZABRANA ŠTAMPARIJA: {selectedShop.name}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ukupna cena:
              </Typography>
              <Typography variant="h4" sx={{ color: "secondary.main", fontWeight: 700 }}>
                {strapiService.calculatePrintCost(selectedShop, fileData.pageCount, printOptions)} RSD
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                Detalji cene:
              </Typography>
              <Typography variant="body2">
                • {fileData.pageCount} strana × {printOptions.copies} kopija
              </Typography>
              <Typography variant="body2">• {printOptions.colorPrinting ? "U boji" : "Crno-belo"} štampa</Typography>
              <Typography variant="body2">• {printOptions.paperType} papir</Typography>
              {printOptions.binding !== "none" && (
                <Typography variant="body2">• {printOptions.binding} povezivanje</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            px: 3,
            py: 1.5,
          }}
        >
          Nazad
        </Button>

        <Button
          variant="contained"
          color="secondary"
          endIcon={<PaymentIcon />}
          onClick={handleOrderSubmit}
          disabled={!selectedShop}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          Naruči i plati
        </Button>
      </Box>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "primary.main", fontWeight: 700 }}>POTVRDA NARUDŽBE</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Molimo unesite vaše podatke za potvrdu narudžbe:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ime i prezime"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email adresa"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Broj telefona"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Ukupno za plaćanje:
            </Typography>
            <Typography variant="h4" sx={{ color: "secondary.main", fontWeight: 700 }}>
              {selectedShop && strapiService.calculatePrintCost(selectedShop, fileData.pageCount, printOptions)} RSD
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
              Plaćanje pri preuzimanju u štampariji
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowPaymentDialog(false)} disabled={submitting}>
            Otkaži
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePaymentConfirm}
            disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || submitting}
            sx={{ px: 3 }}
          >
            {submitting ? <CircularProgress size={20} /> : "Potvrdi narudžbu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default ShopSelectionSection
