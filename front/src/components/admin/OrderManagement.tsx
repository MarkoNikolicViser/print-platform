"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { usePrintJobs } from "../../hooks/usePrintJobs"
import type { PrintJob } from "../../types"

const OrderManagement: React.FC = () => {
  const { printJobs, loading, error, updateJobStatus } = usePrintJobs({ shopId: "1" }) // Mock shop ID
  const [selectedOrder, setSelectedOrder] = useState<PrintJob | null>(null)
  const [showOrderDialog, setShowOrderDialog] = useState(false)

  const getStatusColor = (status: PrintJob["status"]) => {
    switch (status) {
      case "pending":
        return "warning"
      case "processing":
        return "info"
      case "ready":
        return "success"
      case "completed":
        return "default"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: PrintJob["status"]) => {
    switch (status) {
      case "pending":
        return "Na čekanju"
      case "processing":
        return "U obradi"
      case "ready":
        return "Spremno"
      case "completed":
        return "Završeno"
      case "cancelled":
        return "Otkazano"
      default:
        return status
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: PrintJob["status"]) => {
    await updateJobStatus(orderId, newStatus)
  }

  const handleViewOrder = (order: PrintJob) => {
    setSelectedOrder(order)
    setShowOrderDialog(true)
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
        Greška pri učitavanju narudžbi: {error}
      </Alert>
    )
  }

  const pendingOrders = printJobs.filter((job) => job.status === "pending" || job.status === "processing")
  const completedOrders = printJobs.filter((job) => job.status === "ready" || job.status === "completed")

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
        UPRAVLJANJE NARUDŽBAMA
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "warning.main",
              backgroundColor: "rgba(245, 158, 11, 0.05)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ color: "warning.main", fontWeight: 700 }}>
                {printJobs.filter((job) => job.status === "pending").length}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Na čekanju
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "info.main",
              backgroundColor: "rgba(59, 130, 246, 0.05)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ color: "info.main", fontWeight: 700 }}>
                {printJobs.filter((job) => job.status === "processing").length}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                U obradi
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "success.main",
              backgroundColor: "rgba(16, 185, 129, 0.05)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ color: "success.main", fontWeight: 700 }}>
                {printJobs.filter((job) => job.status === "ready").length}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Spremno
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "secondary.main",
              backgroundColor: "rgba(249, 115, 22, 0.05)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ color: "secondary.main", fontWeight: 700 }}>
                {printJobs.reduce((sum, job) => sum + job.totalCost, 0)} RSD
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ukupan promet
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Orders Table */}
      <Paper
        sx={{
          border: "2px solid",
          borderColor: "primary.main",
          mb: 4,
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "primary.main" }}>
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>
            AKTIVNE NARUDŽBE
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fajl</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Strane</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cena</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Datum</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Akcije</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.fileName}</TableCell>
                  <TableCell>{order.pageCount}</TableCell>
                  <TableCell>
                    <Chip label={getStatusLabel(order.status)} color={getStatusColor(order.status)} size="small" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{order.totalCost} RSD</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString("sr-RS")}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleViewOrder(order)}>
                        Prikaži
                      </Button>
                      {order.status === "pending" && (
                        <Button size="small" color="info" onClick={() => handleStatusUpdate(order.id, "processing")}>
                          Počni
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button
                          size="small"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleStatusUpdate(order.id, "ready")}
                        >
                          Završi
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {pendingOrders.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Nema aktivnih narudžbi
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onClose={() => setShowOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "primary.main", fontWeight: 700 }}>DETALJI NARUDŽBE #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Fajl:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {selectedOrder.fileName}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Broj strana:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {selectedOrder.pageCount}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Status:
                </Typography>
                <Chip
                  label={getStatusLabel(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status)}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Ukupna cena:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {selectedOrder.totalCost} RSD
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Datum kreiranja:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {new Date(selectedOrder.createdAt).toLocaleString("sr-RS")}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  Opcije štampe:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  <Chip
                    label={selectedOrder.printOptions.colorPrinting ? "U boji" : "Crno-belo"}
                    size="small"
                    color={selectedOrder.printOptions.colorPrinting ? "secondary" : "default"}
                  />
                  <Chip
                    label={selectedOrder.printOptions.doubleSided ? "Dvostrano" : "Jednostrano"}
                    size="small"
                    variant="outlined"
                  />
                  <Chip label={`${selectedOrder.printOptions.paperType} papir`} size="small" variant="outlined" />
                  {selectedOrder.printOptions.binding !== "none" && (
                    <Chip label={selectedOrder.printOptions.binding} size="small" variant="outlined" />
                  )}
                  <Chip label={`${selectedOrder.printOptions.copies} kopija`} size="small" variant="outlined" />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOrderDialog(false)}>Zatvori</Button>
          {selectedOrder?.status === "pending" && (
            <Button
              color="info"
              onClick={() => {
                handleStatusUpdate(selectedOrder.id, "processing")
                setShowOrderDialog(false)
              }}
            >
              Počni obradu
            </Button>
          )}
          {selectedOrder?.status === "processing" && (
            <Button
              color="success"
              onClick={() => {
                handleStatusUpdate(selectedOrder.id, "ready")
                setShowOrderDialog(false)
              }}
            >
              Označi kao spremno
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderManagement
