import type React from "react"
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import PrintIcon from "@mui/icons-material/Print"

const Header: React.FC = () => {
  const navigate = useNavigate()

  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PrintIcon sx={{ fontSize: 32 }} />
            <Typography
              variant="h1"
              component={Link}
              to="/"
              sx={{
                fontSize: "1.5rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              PrintSerbia
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 600 }}>
              Početna
            </Button>
            <Button color="inherit" component={Link} to="/profile" sx={{ fontWeight: 600 }}>
              Profil
            </Button>
            <Button color="inherit" component={Link} to="/admin" sx={{ fontWeight: 600 }}>
              Admin
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "secondary.main",
                  backgroundColor: "secondary.main",
                },
              }}
              component={Link}
              to="/login"
            >
              Prijava
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
