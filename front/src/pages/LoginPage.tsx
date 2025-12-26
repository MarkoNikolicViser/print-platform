"use client"

import type React from "react"
import { useState } from "react"
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Divider } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        setError("Registracija uspešna! Molimo proverite email za potvrdu.")
      } else {
        await signIn(email, password)
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message || "Greška pri prijavljivanju")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          border: "2px solid",
          borderColor: "primary.main",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 3,
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            {isSignUp ? "REGISTRACIJA" : "PRIJAVA"}
          </Typography>

          {error && (
            <Alert severity={error.includes("uspešna") ? "success" : "error"} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email adresa"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 700,
                mb: 2,
              }}
            >
              {loading ? "Molimo sačekajte..." : isSignUp ? "REGISTRUJ SE" : "PRIJAVI SE"}
            </Button>
          </form>

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="text"
            onClick={() => setIsSignUp(!isSignUp)}
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            {isSignUp ? "Već imate nalog? Prijavite se" : "Nemate nalog? Registrujte se"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage
