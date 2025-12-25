"use client"

import { useState, useEffect } from "react"
import { Container, Paper, Typography, Box, Button, Card, CardContent, Chip, Divider, Alert } from "@mui/material"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  fileName: string
  copies: number
  color: boolean
  doubleSided: boolean
  shopName: string
  totalPrice: number
  status: "pending" | "processing" | "ready" | "completed"
  orderDate: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load mock orders
    const mockOrders: Order[] = [
      {
        id: "1",
        fileName: "Ugovor.pdf",
        copies: 2,
        color: false,
        doubleSided: true,
        shopName: "Copy Shop Centar",
        totalPrice: 120,
        status: "completed",
        orderDate: "2024-01-15",
      },
      {
        id: "2",
        fileName: "Prezentacija.pptx",
        copies: 10,
        color: true,
        doubleSided: false,
        shopName: "Print Express",
        totalPrice: 850,
        status: "ready",
        orderDate: "2024-01-20",
      },
      {
        id: "3",
        fileName: "CV.docx",
        copies: 5,
        color: false,
        doubleSided: false,
        shopName: "Copy Shop Novi Sad",
        totalPrice: 200,
        status: "processing",
        orderDate: "2024-01-22",
      },
    ]
    setOrders(mockOrders)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "ready":
        return "info"
      case "processing":
        return "warning"
      case "pending":
        return "default"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Završeno"
      case "ready":
        return "Spremno za preuzimanje"
      case "processing":
        return "U obradi"
      case "pending":
        return "Na čekanju"
      default:
        return status
    }
  }

  if (!user) return null

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: "#1e3a8a", fontWeight: 600 }}>
          Moj Profil
        </Typography>
        <Button variant="outlined" onClick={handleLogout} sx={{ color: "#1e3a8a", borderColor: "#1e3a8a" }}>
          Odjavi se
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#1e3a8a" }}>
          Informacije o korisniku
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Ime:</strong> {user.name}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#1e3a8a", mb: 3 }}>
          Istorija štampanja ({orders.length} porudžbina)
        </Typography>

        {orders.length === 0 ? (
          <Alert severity="info">
            Nemate još uvek nijednu porudžbinu.{" "}
            <Button href="/" sx={{ ml: 1 }}>
              Počnite štampanje
            </Button>
          </Alert>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {orders.map((order) => (
              <Card key={order.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ color: "#1e3a8a" }}>
                        {order.fileName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Porudžbina #{order.id} • {order.orderDate}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status) as any}
                      variant="filled"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, mb: 2 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Copy Shop
                      </Typography>
                      <Typography variant="body1">{order.shopName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Broj kopija
                      </Typography>
                      <Typography variant="body1">{order.copies}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Opcije
                      </Typography>
                      <Typography variant="body1">
                        {order.color ? "U boji" : "Crno-belo"} • {order.doubleSided ? "Duplex" : "Jednostrano"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ukupna cena
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#f97316", fontWeight: 600 }}>
                        {order.totalPrice} RSD
                      </Typography>
                    </Box>
                  </Box>

                  {order.status === "ready" && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Vaša porudžbina je spremna za preuzimanje u {order.shopName}!
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="contained" href="/" sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" } }}>
          Nova porudžbina
        </Button>
      </Box>
    </Container>
  )
}
