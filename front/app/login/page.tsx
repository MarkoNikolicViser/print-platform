"use client"

import type React from "react"

import { useState } from "react"
import { Box, Container, Paper, TextField, Button, Typography, Link, Alert, Tabs, Tab } from "@mui/material"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { strapiService } from "@/services/strapiService"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function LoginPage() {
  const [tabValue, setTabValue] = useState(0)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [adminData, setAdminData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return strapiService.loginUser(email, password);
    },
    onSuccess: (data) => {
      const { app_role, username, email } = data?.user
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email,
          name: username,
          role: app_role,
          orders: [],
        }),
      )
      if (app_role === "shop") {
        router.push("/admin");
      } else {
        router.push("/profile")
      }
      // toast("Uspesno logovanje", { type: "success" });
      // Cookies.set("jwt", data?.jwt);
      // navigate("/home");
    },
    onError: () => {
      // toast("Greska", { type: "error" });
    },
  });


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email: loginData.email, password: loginData.password })

    // Simulate login
    // setTimeout(() => {
    //   localStorage.setItem(
    //     "user",
    //     JSON.stringify({
    //       email: loginData.email,
    //       name: loginData.,
    //       orders: [],
    //     }),
    //   )
    //   setLoading(false)
    //   router.push("/profile")
    // }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      setError("Lozinke se ne poklapaju")
      return
    }

    setLoading(true)
    setError("")

    // Simulate registration
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: registerData.email,
          name: registerData.name,
          orders: [],
        }),
      )
      setLoading(false)
      router.push("/profile")
    }, 1000)
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate admin login
    setTimeout(() => {
      if (adminData.email === "admin@copyshop.rs" && adminData.password === "admin123") {
        localStorage.setItem(
          "admin",
          JSON.stringify({
            email: adminData.email,
            shopName: "Copy Shop Beograd",
            role: "admin",
          }),
        )
        setLoading(false)
        router.push("/admin")
      } else {
        setError("Neispravni podaci za administratora")
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: "#1e3a8a", fontWeight: 600 }}>
          Prijava
        </Typography>

        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} centered sx={{ mb: 2 }}>
          <Tab label="Korisnik" />
          <Tab label="Registracija" />
          <Tab label="Administrator" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" } }}
            >
              {loading ? "Prijavljivanje..." : "Prijavite se"}
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Ime i prezime"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Potvrdite lozinku"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" } }}
            >
              {loading ? "Registracija..." : "Registrujte se"}
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box component="form" onSubmit={handleAdminLogin}>
            <TextField
              fullWidth
              label="Admin Email"
              type="email"
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
              margin="normal"
              required
              placeholder="admin@copyshop.rs"
            />
            <TextField
              fullWidth
              label="Admin Lozinka"
              type="password"
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              margin="normal"
              required
              placeholder="admin123"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, bgcolor: "#1e3a8a", "&:hover": { bgcolor: "#1e40af" } }}
            >
              {loading ? "Prijavljivanje..." : "Admin Prijava"}
            </Button>
          </Box>
        </TabPanel>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link href="/" sx={{ color: "#1e3a8a" }}>
            Nazad na početnu
          </Link>
        </Box>
      </Paper>
    </Container>
  )
}
