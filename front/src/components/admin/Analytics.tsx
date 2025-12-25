"use client"

import type React from "react"
import { Box, Typography, Card, CardContent, Grid } from "@mui/material"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PrintIcon from "@mui/icons-material/Print"
import PeopleIcon from "@mui/icons-material/People"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

const Analytics: React.FC = () => {
  // Mock data - in real app this would come from Strapi
  const analyticsData = {
    totalOrders: 156,
    totalRevenue: 23450,
    totalPages: 3420,
    totalCustomers: 89,
    monthlyGrowth: 12.5,
    popularServices: [
      { name: "Crno-belo štampanje", count: 89 },
      { name: "Štampanje u boji", count: 45 },
      { name: "Spiralno povezivanje", count: 22 },
    ],
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
        ANALITIKA I IZVEŠTAJI
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
              backgroundColor: "rgba(30, 58, 138, 0.05)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <PrintIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 700 }}>
                {analyticsData.totalOrders}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ukupno narudžbi
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "secondary.main",
              backgroundColor: "rgba(249, 115, 22, 0.05)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <AttachMoneyIcon sx={{ fontSize: 40, color: "secondary.main", mb: 1 }} />
              <Typography variant="h4" sx={{ color: "secondary.main", fontWeight: 700 }}>
                {analyticsData.totalRevenue.toLocaleString()} RSD
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ukupan prihod
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "info.main",
              backgroundColor: "rgba(59, 130, 246, 0.05)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <PrintIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h4" sx={{ color: "info.main", fontWeight: 700 }}>
                {analyticsData.totalPages.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ukupno strana
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "success.main",
              backgroundColor: "rgba(16, 185, 129, 0.05)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <PeopleIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4" sx={{ color: "success.main", fontWeight: 700 }}>
                {analyticsData.totalCustomers}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ukupno kupaca
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Growth and Popular Services */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 3 }}>
                MESEČNI RAST
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUpIcon sx={{ fontSize: 60, color: "success.main", mr: 2 }} />
                <Box>
                  <Typography variant="h3" sx={{ color: "success.main", fontWeight: 700 }}>
                    +{analyticsData.monthlyGrowth}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    u odnosu na prošli mesec
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 3 }}>
                NAJPOPULARNIJE USLUGE
              </Typography>

              {analyticsData.popularServices.map((service, index) => (
                <Box
                  key={service.name}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                    borderBottom: index < analyticsData.popularServices.length - 1 ? "1px solid #e5e7eb" : "none",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {service.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: "secondary.main",
                      backgroundColor: "rgba(249, 115, 22, 0.1)",
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {service.count}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics
