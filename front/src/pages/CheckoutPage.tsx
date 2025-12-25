"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Container, Paper, Typography, Box, Grid, Card, CardContent, Button, Divider, Chip, Alert } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import type { PrintJob } from "../types"

const CheckoutPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<PrintJob | null>(null)

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.orderData) {
      setOrderData(location.state.orderData)
    } else {
      // Redirect to home if no order data
      navigate("/")
    }
  }, [location.state, navigate])

  if (!orderData) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Nema podataka o narudžbi. Molimo pokušajte ponovo.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
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

          <Typography
            variant="h1"
            sx={{
              mb: 2,
              fontSize: "2rem",
              color: "success.main",
            }}
          >
            NARUDŽBA USPEŠNO KREIRANA!
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: "text.primary" }}>
            Hvala vam na poverenju. Vaša narudžba je poslata u štampariju i uskoro će biti spremna za preuzimanje.
          </Typography>

          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
              mb: 4,
              textAlign: "left",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 3 }}>
                DETALJI NARUDŽBE
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      ID narudžbe:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      #{orderData.id}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Fajl:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {orderData.fileName}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Broj strana:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {orderData.pageCount}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Status:
                    </Typography>
                    <Chip label="Na čekanju" color="warning" size="small" sx={{ fontWeight: 600 }} />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Ukupna cena:
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "secondary.main",
                        fontWeight: 700,
                      }}
                    >
                      {orderData.totalCost} RSD
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                Opcije štampe:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <Chip
                  label={orderData.printOptions.colorPrinting ? "U boji" : "Crno-belo"}
                  size="small"
                  color={orderData.printOptions.colorPrinting ? "secondary" : "default"}
                />
                <Chip
                  label={orderData.printOptions.doubleSided ? "Dvostrano" : "Jednostrano"}
                  size="small"
                  variant="outlined"
                />
                <Chip label={`${orderData.printOptions.paperType} papir`} size="small" variant="outlined" />
                {orderData.printOptions.binding !== "none" && (
                  <Chip label={orderData.printOptions.binding} size="small" variant="outlined" />
                )}
                <Chip label={`${orderData.printOptions.copies} kopija`} size="small" variant="outlined" />
              </Box>
            </CardContent>
          </Card>

          <Alert severity="info" sx={{ mb: 4, textAlign: "left" }}>
            <Typography variant="body2">
              <strong>Napomena:</strong> Dobićete email obaveštenje kada bude vaša narudžba spremna za preuzimanje.
              Plaćanje se vrši pri preuzimanju u štampariji.
            </Typography>
          </Alert>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/")}
              sx={{ px: 4, py: 1.5 }}
            >
              Nova narudžba
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate("/profile")}
              sx={{ px: 4, py: 1.5 }}
            >
              Moje narudžbe
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default CheckoutPage
