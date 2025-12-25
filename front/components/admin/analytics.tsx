"use client";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Paper,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "Ukupni prihod",
    value: "45,230 RSD",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    period: "ovaj mesec",
  },
  {
    title: "Narudžbine",
    value: "127",
    change: "+8.2%",
    trend: "up",
    icon: FileText,
    period: "ovaj mesec",
  },
  {
    title: "Novi korisnici",
    value: "34",
    change: "-2.1%",
    trend: "down",
    icon: Users,
    period: "ove nedelje",
  },
  {
    title: "Prosečno vreme",
    value: "45 min",
    change: "-5.3%",
    trend: "up",
    icon: Clock,
    period: "po narudžbini",
  },
];

const recentOrders = [
  {
    id: "PS1234567",
    customer: "Ana Marković",
    amount: "320 RSD",
    status: "completed",
    time: "pre 2 sata",
  },
  {
    id: "PS1234568",
    customer: "Petar Nikolić",
    amount: "150 RSD",
    status: "processing",
    time: "pre 3 sata",
  },
  {
    id: "PS1234569",
    customer: "Milica Jovanović",
    amount: "480 RSD",
    status: "ready",
    time: "pre 5 sati",
  },
  {
    id: "PS1234570",
    customer: "Stefan Popović",
    amount: "220 RSD",
    status: "completed",
    time: "pre 1 dan",
  },
];

const getStatusChip = (status: string) => {
  switch (status) {
    case "completed":
      return <Chip label="Završeno" color="success" size="small" />;
    case "processing":
      return <Chip label="U obradi" color="info" size="small" />;
    case "ready":
      return <Chip label="Spremno" color="warning" size="small" />;
    default:
      return <Chip label={status} variant="outlined" size="small" />;
  }
};

export function Analytics() {
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {/* Header */}
      <Box>
        <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
          Pregled poslovanja
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Statistike i performanse vaše štamparije
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={stat.title}>
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Icon size={16} color="#888" />
                    </Box>
                  }
                />
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <TrendIcon size={14} color={isPositive ? "green" : "red"} />
                    <Typography variant="caption" color={isPositive ? "green" : "red"}>
                      {stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      od prošlog meseca
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {stat.period}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Orders & Quick Actions */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title={
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  Poslednje narudžbine
                </Typography>
              }
            />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                {recentOrders.map((order) => (
                  <Paper key={order.id} sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="body1" color="primary" fontWeight="medium">
                        {order.customer}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {order.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.time}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body1" color="primary" fontWeight="bold">
                        {order.amount}
                      </Typography>
                      {getStatusChip(order.status)}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title={
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  Brze akcije
                </Typography>
              }
            />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="medium">
                    Narudžbine na čekanju
                  </Typography>
                  <Typography variant="h6" color="primary">8</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Potrebna je vaša pažnja
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="medium">
                    Spremne za preuzimanje
                  </Typography>
                  <Typography variant="h6" color="primary">3</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Obavestiti korisnike
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="medium">
                    Prosečna ocena
                  </Typography>
                  <Typography variant="h6" color="primary">4.8 ⭐</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Na osnovu 124 recenzije
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}