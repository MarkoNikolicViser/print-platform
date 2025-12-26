"use client"

import type React from "react"
import { useState } from "react"
import { Box, Card, CardContent, Typography, TextField, Button, Grid, Alert, List, ListItem, Chip } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { usePrintJobs } from "../hooks/usePrintJobs"

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const { printJobs, loading: jobsLoading } = usePrintJobs()

  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await updateProfile({ displayName, phone, address })
      setMessage("Profil je uspešno ažuriran!")
    } catch (error: any) {
      setMessage("Greška pri ažuriranju profila: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "processing":
        return "info"
      case "completed":
        return "success"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Na čekanju"
      case "processing":
        return "U obradi"
      case "completed":
        return "Završeno"
      case "cancelled":
        return "Otkazano"
      default:
        return status
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          color: "primary.main",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        MOJ PROFIL
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: "primary.main",
                  fontWeight: 700,
                }}
              >
                LIČNI PODACI
              </Typography>

              {message && (
                <Alert severity={message.includes("uspešno") ? "success" : "error"} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              <form onSubmit={handleUpdateProfile}>
                <TextField
                  fullWidth
                  label="Ime i prezime"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField fullWidth label="Email adresa" value={user?.email || ""} disabled sx={{ mb: 2 }} />

                <TextField
                  fullWidth
                  label="Broj telefona"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Adresa"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}
                >
                  {loading ? "Ažuriranje..." : "AŽURIRAJ PROFIL"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Order History */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: "primary.main",
                  fontWeight: 700,
                }}
              >
                ISTORIJA NARUDŽBI
              </Typography>

              {jobsLoading ? (
                <Typography>Učitavanje narudžbi...</Typography>
              ) : printJobs.length === 0 ? (
                <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
                  Nemate još uvek narudžbi
                </Typography>
              ) : (
                <List>
                  {printJobs.slice(0, 5).map((job) => (
                    <ListItem
                      key={job.id}
                      sx={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 1,
                        mb: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {job.fileName}
                        </Typography>
                        <Chip
                          label={getStatusText(job.status)}
                          color={getStatusColor(job.status) as any}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                        {job.copyShop} • {job.pages} strana • {job.totalPrice} RSD
                      </Typography>

                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {new Date(job.createdAt).toLocaleDateString("sr-RS")}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProfilePage
